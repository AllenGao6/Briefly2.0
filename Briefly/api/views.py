from django.core.exceptions import ValidationError
from django.db.models.expressions import Col
from .models import Collection, Video, Audio
from django.shortcuts import render
from rest_framework import serializers, viewsets
from .serializers import AudioSerializer, VideoSerializer, CollectionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from Briefly import settings
import boto3
from .permissions import CollectionUserPermission,VideoUserPermission, AudioUserPermission
from django.db.models import Q
from django.core.mail import send_mail
from math import ceil
class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [VideoUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Video.objects.filter(Q(collection=self.kwargs['collection_pk']))

    '''
    similar to post_save: call save twice to know the id of the video just created and save to the correct directory
    '''
    def perform_create(self, serializer):
        
        # storage check
        user = self.request.user
        fileSize = None
        if serializer.context['request'].FILES.get('video'):
            fileSize = int(ceil(serializer.context['request'].FILES['video'].size))
            if fileSize + user.userprofile.total_limit >= settings.MAX_SIZE_PER_USER:
                raise ValidationError(f"You have reached the limit {user.userprofile.total_limit//1024//1024} mb of {settings.MAX_SIZE_PER_USER//1024//1024} mb")
            print(f"creating before: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")
        
        
        instance = serializer.save()
        instance.video.delete(save=False)
        serializer.save()  #update from serializer, worked
        
        if fileSize:
            user.userprofile.total_limit += fileSize
            user.userprofile.save()
            print(f"creating after: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")
        
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
    
    def perform_destroy(self, instance):
        
        #storage back
        user = self.request.user
        fileSize = None
        if instance.video:
            fileSize = instance.video.size
        video_id = instance.pk
        
        instance.video.delete(save=False)
        if instance.audioText:
            instance.audioText.delete(save=False)
        
        if fileSize:
            print(f"destroying before: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")
            user.userprofile.total_limit -= fileSize
            user.userprofile.save()
            print(f"destroying after: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")
        return super().perform_destroy(instance)
    
    def destroy(self, request, *args, **kwargs):
        id = self.get_object().pk
        super().destroy(request,*args, **kwargs)
        print(f"\nID{id}")
        return Response({'video_id':id}, status=status.HTTP_202_ACCEPTED)
      
    def perform_update(self, serializer):
        
        #storage update
        original_video = self.get_object()
        user = self.request.user
        original_fileSize = ceil(original_video.video.size)
        new_fileSize = int(ceil(serializer.context['request'].FILES['video'].size))
        filesize_diff = new_fileSize-original_fileSize
        
        if user.userprofile.total_limit+filesize_diff >= settings.MAX_SIZE_PER_USER:
            raise ValidationError(f"You have reached the limit {settings.MAX_SIZE_PER_USER//1024} mb by {user.userprofile.total_limit//1024//1024} mb")
        
        
        if serializer.context['request'].FILES.get('video'):
            original_video.video.delete(save=False)
        if serializer.context['request'].FILES.get('audioText'):
            original_video.audioText.delete(save=False)
        print(f"updating before: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")

        self.perform_update(serializer)
        user.userprofile.total_limit += filesize_diff
        user.userprofile.save()
        print(f"updating after: limit: {user.userprofile.total_limit} of {settings.MAX_SIZE_PER_USER}")
        
        
    #override create
    '''def create(self, request, *args, **kwargs):
        print(self.kwargs['collection_pk'])
        return Response({})
    '''
    
    # # Test
    # @action(methods=['get'], detail=False)
    # def newest(self, request):
    #     newest = self.get_queryset().order_by("created").last()
    #     serializer = self.get_serializer_class()(newest)
    #     return Response(serializer.data)
    
    '''
    Description: when summary is ready, this should be called to send email
    '''
    def summary_ready(self, video):
        mail = send_mail(
            'You Summarization Is Ready at Briefly-AI',
            f'Hi {video.collection.owner},\n      your video: {video.title} in {video.collection} is ready!\n      please go to Briefly-AI.com to check out!',
            'hugh_megumi@qq.com',
            [str(video.collection.owner.email)],
            fail_silently=False
        )
        return mail
    
    '''
    Description: call this url to begin summarization
    URL: summary_begin (always the method name)
    '''
    @action(methods=['get'],detail=True)
    def summary_begin(self, request, *args, **kwargs):
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user))
        if video:
            video = video[0]
            
            if not video.summarization:
                try:
                    # code to perform summarization process
                    self.summary_ready(video)
                    return Response("Success!")
                except:
                    return Response("fail to summarize", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    
    
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

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.image.delete(save=False)
        serializer.save()  #update from serializer, worked

    def perform_update(self, serializer):
        original_collection = self.get_object()
        if serializer.context['request'].FILES.get('image'):
            original_collection.image.delete(save=False)
        return super().perform_update(serializer)
    
    def perform_destroy(self, instance):
        instance.image.delete(save=False)
        super().perform_destroy(instance)

    def destroy(self, request, *args, **kwargs):
        id = self.get_object().pk
        super().destroy(request,*args, **kwargs)
        print(f"\nID{id}")
        return Response({'collection_id':id}, status=status.HTTP_202_ACCEPTED)
        
        ''' Return all info of the deleted Collection '''
        # serializer = self.get_serializer(self.get_object())
        # super().destroy(request,*args, **kwargs)
        # return Response(serializer.data, status=status.HTTP_200_OK)
    
class AudioViewSet(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [AudioUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Audio.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user))

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.audio.delete(save=False)
        serializer.save()  #update from serializer, worked
        
    def perform_destroy(self, instance):
        instance.audio.delete(save=False)
        if instance.audioText:
            instance.audioText.delete(save=False)
        return super().perform_destroy(instance)
    
    def destroy(self, request, *args, **kwargs):
        id = self.get_object().pk
        super().destroy(request,*args, **kwargs)
        print(f"\nID{id}")
        return Response({'audio_id':id}, status=status.HTTP_202_ACCEPTED)
    
    def perform_update(self, serializer):
        original_audio = self.get_object()
        if serializer.context['request'].FILES.get('audio'):
            original_audio.audio.delete(save=False)
        if serializer.context['request'].FILES.get('audioText'):
            original_audio.audioText.delete(save=False)
        return super().perform_update(serializer)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search(request):
    query = request.data.get("query", "")
    user = request.user
    if query:
        collections = Collection.objects.filter(Q(owner=user) & (Q(name__icontains=query) | Q(description__icontains=query)))
        serializer = CollectionSerializer(collections, many=True)
        return Response(serializer.data)
    else:
        return Response({'collection':[]})
    
