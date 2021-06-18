from django.db.models.expressions import Col
from .models import Collection, Video
from django.shortcuts import render
from rest_framework import serializers, viewsets
from .serializers import VideoSerializer, CollectionSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from Briefly import settings
import boto3
from .permissions import CollectionUserPermission,VideoUserPermission
from django.db.models import Q

class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [VideoUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Video.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user))

    '''similar to post_save: call save twice to know the id of the video just created and save to the correct directory'''
    def perform_create(self, serializer):
        instance = serializer.save()
        instance.video.delete(save=False)
        serializer.save()  #update from serializer, worked
    
    def perform_destroy(self, instance):
        instance.video.delete(save=False)
        return super().perform_destroy(instance)
        
        '''another way: update from instance itself, also worked but lengthy'''
        # update from instance itself
        # url = instance.video.url
        # print(f"url: {url}")
        # file = serializer.context['request'].FILES['video']
        # print(file)
        # instance.video = file
        # instance.save()
    
        ''' No need to do this step: but keep here as a reference'''
        #s3 = boto3.resource('s3')
        #s3.Object(settings.AWS_STORAGE_BUCKET_NAME, url).delete()

        
    #override create
    '''def create(self, request, *args, **kwargs):
        print(self.kwargs['collection_pk'])
        return Response({})
    '''
    # Test
    @action(methods=['get'], detail=False)
    def newest(self, request):
        newest = self.get_queryset().order_by("created").last()
        serializer = self.get_serializer_class()(newest)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):
    user = request.user
    return Response({'user':user.email})

class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [CollectionUserPermission]

    def get_queryset(self,*args, **kwargs):
        #currently authenticated user
        user = self.request.user
        print(user)
        return Collection.objects.filter(owner=user)
