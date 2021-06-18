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

class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    def get_queryset(self, *args, **kwargs):
        return Video.objects.filter(collection=self.kwargs['collection_pk'])

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

    def get_queryset(self,*args, **kwargs):
        #currently authenticated user
        user = self.request.user
        print(user)
        return Collection.objects.filter(owner=user)
