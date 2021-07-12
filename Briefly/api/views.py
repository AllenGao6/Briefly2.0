from django.core.exceptions import ValidationError
from django.db.models.expressions import Col
from django.db import transaction
import transformers
from .models import Collection, Video, Audio
from social_login.models import UserProfile
from django.shortcuts import render, get_object_or_404
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
from . import speech_to_text
from math import ceil
from pprint import pprint
from json import dumps, loads
from time import time
class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated,VideoUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Video.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user.pk))

    '''
    similar to post_save: call save twice to know the id of the video just created and save to the correct directory
    '''
    def perform_create(self, serializer):
        t1 = time()
        #This part ensures the user can only create video under his own collection
        user = self.request.user
        collection = get_object_or_404(Collection,pk =self.kwargs['collection_pk'], owner=user)
        
        # storage check
        fileSize = 0
        if serializer.context['request'].FILES.get('video'):
            fileSize = int(ceil(serializer.context['request'].FILES['video'].size))
            if fileSize >= user.userprofile.remaining_size:
                raise ValidationError(f"video size {fileSize//1024//1024} mb has exceeded your remaining size: {user.userprofile.remaining_size//1024//1024} mb.")
            print(f"creating before: remaining: {user.userprofile.remaining_size}")
        
        
        # save twice for gainning the id of currently constructed video instance
        instance = serializer.save()
        instance.video.delete(save=False)
        instance.fileSize = fileSize
        serializer.save() 
        
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                profile.remaining_size -= fileSize
                profile.save()
                print(f"creating after: remaining: {profile.remaining_size}")
                print(f"video create time spent: {time()-t1:.2f}")
        
    #     '''another way: update from instance itself, also worked but lengthy'''
    #     # update from instance itself
    #     # url = instance.video.url
    #     # print(f"url: {url}")
    #     # file = serializer.context['request'].FILES['video']
    #     # print(file)
    #     # instance.video = file
    #     # instance.save()
    
    #     ''' No need to do this step: but keep here as a reference'''
    #     #s3 = boto3.resource('s3')
    #     #s3.Object(settings.AWS_STORAGE_BUCKET_NAME, url).delete()
    

        
    def perform_destroy(self, instance):
        #storage back
        user = self.request.user
        fileSize = instance.fileSize
        
        if instance.video:
            instance.video.delete(save=False)

        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"destroying before: remaining: {profile.remaining_size}")
                profile.remaining_size += fileSize
                profile.save()
                print(f"destroying after: remaining: {profile.remaining_size}")
        return super().perform_destroy(instance)
    
    
    def destroy(self, request, *args, **kwargs):
        id = self.get_object().pk
        name = self.get_object().title
        super().destroy(request,*args, **kwargs)
        remaining = request.user.userprofile.remaining_size
        return Response({'video_id':id,
                         "title": name,
                         'remaining_size': remaining}, status=status.HTTP_202_ACCEPTED)
    
    # Don't do any 
    # This may not be used as the logic is reverted to the original one
    def perform_update(self, serializer):
        
        user = self.request.user
        instance = serializer.save()
        fileSize = instance.fileSize
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"updating before: remaining: {profile.remaining_size}")
                profile.remaining_size -= fileSize
                profile.save()
                print(f"updating after: remaining: {profile.remaining_size}")
    
    
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
    Description: when summary is ready, this will be automatically called to send notification email to user's email
    '''
    def summary_ready(self, video):
        email_title = 'You Summarization Is Ready at Briefly-AI'
        email_body = f"Hi {video.collection.owner.first_name},\n\n	Your {video.__class__.__name__}: {video.title} in {video.collection} is successfully summarized by our powerful Briefly-AI!\n	Please go to www.Briefly-AI.com and start your journey!\n\n	Briefly-AI team"
        
        mail = send_mail(
            email_title,
            email_body,
            settings.EMAIL_HOST_USER,
            [str(video.collection.owner.email)],
            fail_silently=False
        )
        return mail
    
    '''
    Call this url to begin transcribe from Amazon
    URL: api/<int: collection_id>/video/<int: video_id>/transcribe_begin/
    '''
    @action(methods=['GET'],detail=True)
    def transcribe_begin(self, request, *args, **kwargs):
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if video:
            video = video[0]
            
            if not video.transcript:
                try:
                    # code to perform summarization process
                    t1 = time()   
                    video_path = video.video.name.split('/')
                    video_name, video_id, type, collection_name = video_path[3], video_path[2],video_path[1], video_path[0]   
                    transcribe = speech_to_text.amazon_transcribe(video_name, collection_name, type, video_id)
                    
                    if not transcribe:
                        return Response("Unknown failure during S3 transcribe", status=status.HTTP_400_BAD_REQUEST)
                    #video.transcript = transcribe
                    data = speech_to_text.load_json_output(transcribe)
                    transcript, audioText = speech_to_text.read_output(data)
                    print(f"transcribe time spent: {time()-t1:.2f}")
                    print("transcript: (for dev purpose only! delete before deploy)")
                    pprint(transcript)
                    print("audioText: (for dev purpose only! delete before deploy)")
                    pprint(audioText)
                    video.transcript = dumps(transcript)          #json field
                    video.audioText = audioText
                    video.save()
                    print(f"transcribe time spent: {time()-t1:.2f}")
                except:
                    return Response("Fail to transcribe", status=status.HTTP_400_BAD_REQUEST)

            #self.summary_ready(video)
            return Response("Success!")
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    
    '''
    Call this endpoint to start summarization with all models,
    This endpoint is avaliable if video.audioText is provided.
    
    When method=="GET", no parameters are required, all three models will be to summarized.
    
    When method=="POST", following fields are required:
        model (if None, default: "Bert"),
        num_sentence (if None, default: None),
        max_sentence (if None, default: 20)
         
    URL: api/<int: collection_id>/video/<int: video_id>/summary_begin/
    '''
    @action(methods=['GET', 'POST'],detail=True)
    def summary_begin(self, request, *args, **kwargs):
        t1 = time()
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        if not video.audioText:
            return Response("Cannot find the audioText for this video", status=status.HTTP_400_BAD_REQUEST)
        # if video.summarization:
        #     return Response("You have summarized the video", status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == "POST":
            try:
                print("POST")
                model = request.data.get('model', "Bert")
                num_sentence = request.data.get('num_sentence', None)
                max_sentence = request.data.get('max_sentence', 20)
                summary = speech_to_text.summarize(video.audioText, loads(video.transcript), model=model, num_sentence=num_sentence, max_sentence=max_sentence)
                print(model)
                pprint(summary)
                try:
                    last_summaries = loads(video.summarization)
                except:
                    last_summaries = {}
                last_summaries[model] = summary
                video.summarization = dumps(last_summaries)
                video.save()
                print(f"Individual {model} summarization  time spent: {time()-t1:.2f}")
                pprint(summary)
                return Response(summary, status=status.HTTP_200_OK)
            except:
                return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
        try:
            summary_bert = speech_to_text.summarize(video.audioText, loads(video.transcript), model='Bert')
            summary_gpt2 = speech_to_text.summarize(video.audioText, loads(video.transcript), model='GPT-2')
            summary_xlnet = speech_to_text.summarize(video.audioText, loads(video.transcript), model='XLNet')
            summary_total = dumps({"Bert":summary_bert, "GPT-2":summary_gpt2, "XLNet":summary_xlnet})
            print("Bert")
            pprint(summary_bert)
            print("GPT-2")
            pprint(summary_gpt2)
            print("XLNet")
            pprint(summary_xlnet)
            
            video.summarization = summary_total
            video.save()
            print(f"Three bundle summarization time spent: {time()-t1:.2f}")
            return Response(summary_total, status=status.HTTP_200_OK)

        except:
            return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
    '''
    Call this endpoint to delete a list of videos under one collection
    URL: api/<int: collection_id>/video/delete_list_videos/
    '''
    @action(methods=['POST'],detail=False, permission_classes=[IsAuthenticated])
    def delete_list_videos(self, request, *args, **kwargs):
        user = request.user
        videos_to_delete = request.data.get('list_id', None)
        if not videos_to_delete:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        print(videos_to_delete)
        total_size = 0
        for pk in videos_to_delete:
            video = get_object_or_404(Video, pk=pk, collection__owner=user.pk)
            total_size+=video.fileSize
            self.perform_destroy(video)
                 
        return Response({"list_id": videos_to_delete, 'total_size': total_size, 'remaining_size': user.userprofile.remaining_size})
    
    

class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated,CollectionUserPermission]

    def get_queryset(self,*args, **kwargs):
        #currently authenticated user
        user = self.request.user
        print(user)
        return Collection.objects.filter(owner=user.pk)
    
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
    permission_classes = [IsAuthenticated,AudioUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Audio.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user.pk))

    '''
    similar to post_save: call save twice to know the id of the audio just created and save to the correct directory
    '''
    def perform_create(self, serializer):
        t1 = time()
        #This part ensures the user can only create audio under his own collection
        user = self.request.user
        collection = get_object_or_404(Collection,pk =self.kwargs['collection_pk'], owner=user)
 
        # storage check
        fileSize = 0
        if serializer.context['request'].FILES.get('audio'):
            fileSize = int(ceil(serializer.context['request'].FILES['audio'].size))
            if fileSize >= user.userprofile.remaining_size:
                raise ValidationError(f"audio size {fileSize//1024//1024} mb has exceeded your remaining size: {user.userprofile.remaining_size//1024//1024} mb.")
            print(f"creating before: remaining: {user.userprofile.remaining_size}")
        
        
        # save twice for gainning the id of currently constructed audio instance
        instance = serializer.save()
        instance.audio.delete(save=False)
        instance.fileSize = fileSize
        serializer.save()  #update from serializer, worked
        
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"create before: remaining: {profile.remaining_size}")
                profile.remaining_size -= fileSize
                profile.save()
                print(f"create after: remaining: {profile.remaining_size}")
                print(f"create time spent: {time()-t1:.2f}")
    def perform_destroy(self, instance):
        fileSize = instance.fileSize
        user = self.request.user
        if instance.audio:
            instance.audio.delete(save=False)

        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"destroying before: remaining: {profile.remaining_size}")
                profile.remaining_size += fileSize
                profile.save()
                print(f"destroying after: remaining: {profile.remaining_size}")
        return super().perform_destroy(instance)
        
    def destroy(self, request, *args, **kwargs):
        id = self.get_object().pk
        title = self.get_object().title
        super().destroy(request,*args, **kwargs)
        remaining = request.user.userprofile.remaining_size
        print(f"Destroying : remaining: {remaining}")
    
        return Response({'audio_id':id,
                         "title": title,
                         'remaining_size': remaining}, status=status.HTTP_202_ACCEPTED)
    
    # similarly, this may not be used
    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.save()
        fileSize = instance.fileSize
        
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"updating before: remaining: {profile.remaining_size}")
                profile.remaining_size -= fileSize
                profile.save()
                print(f"updating after: remaining: {profile.remaining_size}")
        
    '''
    Call this endpoint to delete a list of videos under one collection
    URL: api/<int: collection_id>/audio/delete_list_audios/
    '''
    @action(methods=['POST'],detail=False, permission_classes=[IsAuthenticated])
    def delete_list_audios(self, request, *args, **kwargs):
        user = request.user
        audios_to_delete = request.data.get('list_id', None)
        if not audios_to_delete:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        total_size = 0
        for pk in audios_to_delete:
            audio = get_object_or_404(Audio, pk=pk, collection__owner=user.pk)
            total_size+=audio.fileSize
            self.perform_destroy(audio)
                
        return Response({"list_id": audios_to_delete, 'total_size': total_size, 'remaining_size': user.userprofile.remaining_size})
    
    '''
    Call this url to begin transcribe from Amazon
    URL: api/<int: collection_id>/audio/<int: audio_id>/transcribe_begin/
    '''
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def transcribe_begin(self, request, *args, **kwargs):
        t1 = time()
        user = request.user
        audio = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if audio:
            audio = audio[0]
            
            if not audio.transcript:
                try:
                    # code to perform summarization process
                    audio_path = audio.audio.name.split('/')
                    audio_name, audio_id, type, collection_name = audio_path[3], audio_path[2], audio_path[1],audio_path[0]
                    
                    transcribe = speech_to_text.amazon_transcribe(audio_name, collection_name, type, audio_id)
                    
                    if not transcribe:
                        return Response("Unknown failure during S3 transcribe", status=status.HTTP_400_BAD_REQUEST)
                    data = speech_to_text.load_json_output(transcribe)
                    transcript, audioText = speech_to_text.read_output(data)
                    print("audio transcript: dev purpose only")
                    pprint(transcript)
                    print("audio audioText: dev purpose only")
                    pprint(audioText)
                    audio.transcript = dumps(transcript)          #json field
                    audio.audioText = audioText
                    audio.save()
                    print(f"transcribe time spent: {time()-t1:.2f}")
                except:
                    return Response("Fail to transcribe", status=status.HTTP_400_BAD_REQUEST)

            #self.summary_ready(audio)
            return Response("Success!")
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

    '''
    Call this endpoint to start summarization with all models,
    This endpoint is avaliable if video.audioText is provided.
    
    When method=="GET", no parameters are required, all three models will be to summarized.
    
    When method=="POST", following fields are required:
        model (if None, default: "Bert"),
        num_sentence (if None, default: None),
        max_sentence (if None, default: 20)
         
    URL: api/<int: collection_id>/audio/<int: audio_id>/summary_begin/
    '''
    @action(methods=['GET', 'POST'],detail=True, permission_classes=[IsAuthenticated])
    def summary_begin(self, request, *args, **kwargs):
        t1 = time()
        user = request.user
        audio = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        
        if not audio:
            return Response(status=status.HTTP_404_NOT_FOUND)
        audio = audio[0]
        if not audio.audioText:
            return Response("Cannot find the audioText for this audio", status=status.HTTP_400_BAD_REQUEST)
        # if video.summarization:
        #     return Response("You have summarized the video", status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == "POST":
            try:
                print("POST")
                model = request.data.get('model', "Bert")
                num_sentence = request.data.get('num_sentence', None)
                max_sentence = request.data.get('max_sentence', 20)
                summary = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model=model, num_sentence=num_sentence, max_sentence=max_sentence)
                print(model)
                pprint(summary)
                try:
                    last_summaries = loads(audio.summarization)
                except:
                    last_summaries = {}
                last_summaries[model] = summary
                audio.summarization = dumps(last_summaries)
                audio.save()
                print(f"Individual {model} summarization  time spent: {time()-t1:.2f}")
                pprint(summary)
                return Response(summary, status=status.HTTP_200_OK)
            except:
                return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
        # this is for method=="GET"
        try:
            summary_bert = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='Bert')
            summary_gpt2 = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='GPT-2')
            summary_xlnet = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='XLNet')
            summary_total = dumps({"Bert":summary_bert, "GPT-2":summary_gpt2, "XLNet":summary_xlnet})
            print("Bert")
            pprint(summary_bert)
            print("GPT-2")
            pprint(summary_gpt2)
            print("XLNet")
            pprint(summary_xlnet)
            
            audio.summarization = summary_total
            audio.save()
            print(f"Three bundle summarization time spent: {time()-t1:.2f}")
            return Response(summary_total, status=status.HTTP_200_OK)

        except:
            return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search(request):
    query = request.data.get("query", "")
    user = request.user
    if query:
        collections = Collection.objects.filter(Q(owner=user.pk) & (Q(name__icontains=query) | Q(description__icontains=query)))
        serializer = CollectionSerializer(collections, many=True)
        return Response(serializer.data)
    else:
        return Response({'collection':[]})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_remaining(request):
    if request.method == 'GET':
        return Response({'remaining_size': request.user.userprofile.remaining_size})
    