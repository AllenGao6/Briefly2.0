from django.core.exceptions import ValidationError
from django.db.models.expressions import Col
from django.db import transaction
import transformers
from .models import Collection, Video, Audio, Text
from social_login.models import UserProfile
from django.shortcuts import render, get_object_or_404
from rest_framework import serializers, viewsets
from .serializers import AudioSerializer, VideoSerializer, CollectionSerializer, TextSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.conf import settings
import boto3
from .permissions import CollectionUserPermission,VideoUserPermission, AudioUserPermission
from django.db.models import Q
from . import speech_to_text
from math import ceil
from pprint import pprint
from json import dumps, loads
from time import time
from . import quiz_generation, tasks
from django.template.loader import render_to_string
from .tasks import send_email_celery
from django.core.mail import send_mail

class VideoViewSet(viewsets.ModelViewSet):

    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated,VideoUserPermission]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        
        return Video.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user.pk))

    def create(self, request, *args, **kwargs):
        # storage check
        user = request.user
        fileSize = 0
        if request.FILES.get('video'):
            fileSize = int(ceil(request.FILES['video'].size))
            if fileSize >= user.userprofile.remaining_size:
                return Response(f"video size {fileSize//1024//1024} mb has exceeded your remaining size: {user.userprofile.remaining_size//1024//1024} mb.", status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    
    '''
    similar to post_save: call save twice to know the id of the video just created and save to the correct directory
    '''
    def perform_create(self, serializer):
        t1 = time()
        #This part ensures the user can only create video under his own collection
        user = self.request.user
        fileSize = 0
        if serializer.context['request'].FILES.get('video'):
            fileSize = int(ceil(serializer.context['request'].FILES['video'].size))
        
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
        
        #delete the folder
        if instance.video:
            prefix = instance.video.url.split("/")[3:-1]
            prefix = "/".join(prefix)+"/"
            
            s3 = boto3.resource('s3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key= settings.AWS_SECRET_ACCESS_KEY)
            bucket = s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)
            bucket.objects.filter(Prefix=prefix).delete()
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
    Call this url to begin transcribe from Amazon
    URL: api/<int: collection_id>/video/<int: video_id>/transcribe_begin/
    '''
    @action(methods=['GET'],detail=True)
    def transcribe_begin(self, request, *args, **kwargs):
        print("recieved transcribe request")
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if video:
            video = video[0]
            
            if not video.transcript:
                try:
                    # code to perform summarization process
                    t1 = time()
                    video.is_processing = True
                    video.save()
                       
                    video_path = video.video.name.split('/')
                    video_name, video_id, type, collection_name = video_path[3], video_path[2],video_path[1], video_path[0]   
                    transcribe = speech_to_text.amazon_transcribe(video_name, collection_name, type, video_id)
                    
                    if not transcribe:
                        return Response("Unknown failure during S3 transcribe", status=status.HTTP_400_BAD_REQUEST)
                    #video.transcript = transcribe
                    data = speech_to_text.load_json_output(transcribe)
                    transcript, audioText, sentences = speech_to_text.read_output(data)
                    print(f"transcribe time spent: {time()-t1:.2f}")
                    print("transcript: (for dev purpose only! delete before deploy)")
                    pprint(transcript)
                    print("audioText: (for dev purpose only! delete before deploy)")
                    pprint(audioText)
                    video.transcript = dumps(transcript)          #json field
                    video.audioText = audioText
                    
                    print(f"transcribe time spent: {time()-t1:.2f}")
                    
                    # call default_summarize
                    self.default_summarize(video)
                    video.is_processing = False
                    video.save()
                    # call to send email
                    d = { 'username': video.collection.owner.first_name, 
                        'mediaType': video.__class__.__name__.lower(), 
                        'mediaName': video.title,
                        'collection': video.collection.name,
                        'MEDIA_URL': settings.MEDIA_URL}
                    send_email(d)
                except:
                    return Response("Fail to transcribe", status=status.HTTP_400_BAD_REQUEST)

            
            return Response("Success!")
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def default_summarize(self, audio):
        print("recieved default summarize request")
        t1 = time()
        try:
            summary, num_sentence = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model ="XLNet")
            print("default\n")
            pprint(summary)
            audio.model_type = "XLNet"       # XLNet is fastest and uses less memory
            audio.num_sentences = num_sentence
            audio.summarization = dumps(summary)
            audio.is_summarized = True
            
            Quiz = quiz_generation.Quiz_generation(loads(audio.summarization), audio.audioText, based_text="summ")
            res = Quiz.generate("QA_pair_gen", question=None)       # question parameter can be modified if need
            
            audio.quiz = dumps(res)
            print(f"Default summarization time spent: {time()-t1:.2f}")
            return True
            
        except:
            return Response("Fail to generate default summarization", status=status.HTTP_400_BAD_REQUEST)
    
        
        
        
    '''
    Call this endpoint to start summarization with all models,
    This endpoint is avaliable if video.audioText is provided.
    
    Not avaliable: When method=="GET", no parameters are required, all three models will be to summarized.
    
    When method=="POST", following fields are required:
        model (if None, default: "Bert"),
        num_sentence (if None, default: None),
        max_sentence (if None, default: 20)
         
    URL: api/<int: collection_id>/video/<int: video_id>/summary_begin/
    '''
    @action(methods=['POST'],detail=True, permission_classes = [IsAuthenticated])
    def summary_begin(self, request, *args, **kwargs):
        print("recieved summarize request")
        t1 = time()
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        if not video.audioText:
            return Response("Cannot find the audioText for this video", status=status.HTTP_400_BAD_REQUEST)
        if video.is_processing:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            video.is_processing = True
            video.save()
            
            model = request.data.get('model', "Bert")
            
            num_sentence = request.data.get('num_sentence', None)
            if num_sentence is not None:
                num_sentence = int(num_sentence)
            max_sentence = int(request.data.get('max_sentence', 20))
            summary, num_sentence = speech_to_text.summarize(video.audioText, loads(video.transcript), model=model, num_sentence=num_sentence, max_sentence=max_sentence)
            pprint(summary)
            with transaction.atomic():
                video.model_type = model
                video.num_sentences = num_sentence
                video.summarization = dumps(summary)
                video.is_summarized = True
                print(f"Individual {model} summarization  time spent: {time()-t1:.2f}")
                print(model)
                video.is_processing = False
                video.save()
                
                return Response(summary, status=status.HTTP_200_OK)
        except:
            video.is_processing = False
            video.save()
            return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
        # try:
        #     summary_bert = speech_to_text.summarize(video.audioText, loads(video.transcript), model='Bert')
        #     summary_gpt2 = speech_to_text.summarize(video.audioText, loads(video.transcript), model='GPT-2')
        #     summary_xlnet = speech_to_text.summarize(video.audioText, loads(video.transcript), model='XLNet')
        #     summary_total = dumps({"Bert":summary_bert, "GPT-2":summary_gpt2, "XLNet":summary_xlnet})
        #     print("Bert")
        #     pprint(summary_bert)
        #     print("GPT-2")
        #     pprint(summary_gpt2)
        #     print("XLNet")
        #     pprint(summary_xlnet)
            
        #     video.summarization = summary_total
        #     video.save()
        #     print(f"Three bundle summarization time spent: {time()-t1:.2f}")
        #     return Response(summary_total, status=status.HTTP_200_OK)

        # except:
        #     return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
    '''
    Call this endpoint to delete a list of videos under one collection
    URL: api/<int: collection_id>/video/delete_list_videos/
    '''
    @action(methods=['POST'],detail=False, permission_classes=[IsAuthenticated])
    def delete_list_videos(self, request, *args, **kwargs):
        print("recieved delete list videos request")
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
    
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def reset(self, request, *args, **kwargs):
        print("recieved reset video request")
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        try:
            video.is_summarized = False
            video.model_type = False
            video.num_sentences = 0
            video.summarization = None
            video.save()
            return Response(f"{video} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def resetQuiz(self, request, *args, **kwargs):
        print("recieved video quiz reset request")
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        try:
            video.quiz = None
            video.save()
            return Response(f"{video} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)
        
    
    '''
    Call this endpoint to fetch Quiz data
    URL: api/<int: collection_id>/video/<int: video_id>/quiz/
    
    Parameters to POST:
    "task":  "Question_Ans" | "QA_pair_gen" | "Question_gen"
    "based_text": "summ" | "full"
    "question": this parameter is especially needed for Question_Ans
    '''
    @action(methods=['POST'], detail = True, permission_classes = [IsAuthenticated])
    def quiz(self, request, *args, **kwargs):
        print("recieved quiz video request")
        t1 = time()
        user = request.user
        video = Video.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        task = request.data.get('task', 'QA_pair_gen')
        based_text = request.data.get('based_text', 'summ')
        question = request.data.get('question', None)
        if video.summarization == None:
            print("this is aaa")
            return Response({'Message':"Summarization Can't be empty"}, status = 204)
        try:
            video.is_processing = True
            video.save()
            Quiz = quiz_generation.Quiz_generation(loads(video.summarization), video.audioText, based_text=based_text)
            res = Quiz.generate(task, question=question)       # question parameter can be modified if need
            
            video.is_processing = False
            video.quiz = dumps(res)
            video.save()
            print(f"create time spent: {time()-t1:.2f}")
            return Response(res, status=status.HTTP_200_OK)
        except:
            video.is_processing = False
            video.save()
            print("this is reached")
            return Response({'Message':"Quiz Generation Failed"},status = status.HTTP_400_BAD_REQUEST)
        
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
    
    def custom_video_destroy(self, instance):
        #storage back
        user = self.request.user
        fileSize = instance.fileSize
        
        #delete the folder
        if instance.video:
            prefix = instance.video.url.split("/")[3:-1]
            prefix = "/".join(prefix)+"/"
            
            s3 = boto3.resource('s3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key= settings.AWS_SECRET_ACCESS_KEY)
            bucket = s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)
            bucket.objects.filter(Prefix=prefix).delete()
            instance.video.delete(save=False)
            
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"destroying before: remaining: {profile.remaining_size}")
                profile.remaining_size += fileSize
                profile.save()
                print(f"destroying after: remaining: {profile.remaining_size}")
        instance.delete()
        
    def custom_audio_destroy(self, instance):
        fileSize = instance.fileSize
        user = self.request.user
        
        #delete the folder
        
        if instance.audio:
            prefix = instance.audio.url.split("/")[3:-1]
            prefix = "/".join(prefix)+"/"
            
            s3 = boto3.resource('s3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key= settings.AWS_SECRET_ACCESS_KEY)
            bucket = s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)
            bucket.objects.filter(Prefix=prefix).delete()
            instance.audio.delete(save=False)
            
        if fileSize:
            profile = UserProfile.objects.select_for_update().filter(user=user)[0]
            with transaction.atomic():
                print(f"destroying before: remaining: {profile.remaining_size}")
                profile.remaining_size += fileSize
                profile.save()
                print(f"destroying after: remaining: {profile.remaining_size}")
        instance.delete()
    
    def perform_destroy(self, instance):
        audios = instance.audio_set.all()
        videos = instance.video_set.all()
        
        if audios:
            for a in audios:
                self.custom_audio_destroy(a)
        if videos:
            for v in videos:
                self.custom_video_destroy(v)
        
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
    
    def create(self, request, *args, **kwargs):
        # storage check
        user = request.user
        fileSize = 0
        if request.FILES.get('audio'):
            fileSize = int(ceil(request.FILES['audio'].size))
            if fileSize >= user.userprofile.remaining_size:
                return Response(f"audio size {fileSize//1024//1024} mb has exceeded your remaining size: {user.userprofile.remaining_size//1024//1024} mb.", status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    
    '''
    similar to post_save: call save twice to know the id of the audio just created and save to the correct directory
    '''
    def perform_create(self, serializer):
        t1 = time()
        #This part ensures the user can only create video under his own collection
        user = self.request.user
        fileSize = 0
        if serializer.context['request'].FILES.get('audio'):
            fileSize = int(ceil(serializer.context['request'].FILES['audio'].size))
        
        # save twice for gainning the id of currently constructed video instance
        instance = serializer.save()
        instance.audio.delete(save=False)
        instance.fileSize = fileSize
        serializer.save() 
        
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
        
        #delete the folder
        
        if instance.audio:
            prefix = instance.audio.url.split("/")[3:-1]
            prefix = "/".join(prefix)+"/"
            
            s3 = boto3.resource('s3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key= settings.AWS_SECRET_ACCESS_KEY)
            bucket = s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)
            bucket.objects.filter(Prefix=prefix).delete()
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
    @action(methods=['GET'],detail=True)
    def transcribe_begin(self, request, *args, **kwargs):
        print("recieved transcribe request")
        user = request.user
        # here video variable is just an audio, for the sake of convenience
        video = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))

        if video:
            video = video[0]
            
            if not video.transcript:
                try:
                    # code to perform summarization process
                    t1 = time()   
                    
                    video.is_processing = True
                    video.save()
                    
                    video_path = video.audio.name.split('/')
                    video_name, video_id, type, collection_name = video_path[3], video_path[2],video_path[1], video_path[0]   
                    transcribe = speech_to_text.amazon_transcribe(video_name, collection_name, type, video_id)
                    print('2')
                    if not transcribe:
                        return Response("Unknown failure during S3 transcribe", status=status.HTTP_400_BAD_REQUEST)
                    #video.transcript = transcribe
                    data = speech_to_text.load_json_output(transcribe)
                    transcript, audioText, sentences = speech_to_text.read_output(data)
                    print(f"transcribe time spent: {time()-t1:.2f}")
                    print("transcript: (for dev purpose only! delete before deploy)")
                    pprint(transcript)
                    print("audioText: (for dev purpose only! delete before deploy)")
                    pprint(audioText)
                    video.transcript = dumps(transcript)          #json field
                    video.audioText = audioText
                    
                    print(f"transcribe time spent: {time()-t1:.2f}")
                    
                    # call default summarize
                    self.default_summarize(video)
                    video.is_processing = False
                    video.save()
                    # call to send email
                    d = { 'username': video.collection.owner.first_name, 
                        'mediaType': video.__class__.__name__.lower(), 
                        'mediaName': video.title,
                        'collection': video.collection.name,
                        'MEDIA_URL': settings.MEDIA_URL,
                        'TO': video.collection.owner.email}
                    send_email(d)
                except:
                    return Response("Fail to transcribe", status=status.HTTP_400_BAD_REQUEST)

            return Response("Success!")
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def default_summarize(self, audio):
        print("recieved default summarize request")
        t1 = time()
        try:
            summary, num_sentence = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model ="XLNet")
            print("default\n")
            pprint(summary)
            audio.model_type = "XLNet"       # XLNet is fastest and uses less memory
            audio.num_sentences = num_sentence
            audio.summarization = dumps(summary)
            audio.is_summarized = True

            Quiz = quiz_generation.Quiz_generation(loads(audio.summarization), audio.audioText, based_text="summ")
            res = Quiz.generate("QA_pair_gen", question=None)       # question parameter can be modified if need
            
            audio.quiz = dumps(res)
            print(f"Default summarization  time spent: {time()-t1:.2f}")
            return True
        except:
            return Response("Fail to generate default summarization", status=status.HTTP_400_BAD_REQUEST)
    
    
    
    '''
    Call this endpoint to start summarization with all models,
    This endpoint is avaliable if video.audioText is provided.
    
    Not avaliable: When method=="GET", no parameters are required, all three models will be to summarized.
    
    When method=="POST", following fields are required:
        model (if None, default: "Bert"),
        num_sentence (if None, default: None),
        max_sentence (if None, default: 20)
         
    URL: api/<int: collection_id>/audio/<int: audio_id>/summary_begin/
    '''
    @action(methods=['POST'],detail=True)
    def summary_begin(self, request, *args, **kwargs):  
        t1 = time()
        user = request.user
        video = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        if not video.audioText:
            return Response("Cannot find the audioText for this audio", status=status.HTTP_400_BAD_REQUEST)
        if video.is_processing:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            video.is_processing = True
            video.save()
            
            model = request.data.get('model', "Bert")
            
            num_sentence = request.data.get('num_sentence', None)
            if num_sentence is not None:
                num_sentence = int(num_sentence)
            max_sentence = int(request.data.get('max_sentence', 20))
            summary, num_sentence = speech_to_text.summarize(video.audioText, loads(video.transcript), model=model, num_sentence=num_sentence, max_sentence=max_sentence)
            pprint(summary)
            with transaction.atomic():
                video.model_type = model
                video.num_sentences = num_sentence
                video.summarization = dumps(summary)
                video.is_summarized = True
                print(f"Individual {model} summarization  time spent: {time()-t1:.2f}")
                print(model)
                video.is_processing = False
                video.save()
                return Response(summary, status=status.HTTP_200_OK)
        except:
            video.is_processing = False
            video.save()
            return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
            
        # # this is for method=="GET"
        # try:
        #     summary_bert = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='Bert')
        #     summary_gpt2 = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='GPT-2')
        #     summary_xlnet = speech_to_text.summarize(audio.audioText, loads(audio.transcript), model='XLNet')
        #     summary_total = dumps({"Bert":summary_bert, "GPT-2":summary_gpt2, "XLNet":summary_xlnet})
        #     print("Bert")
        #     pprint(summary_bert)
        #     print("GPT-2")
        #     pprint(summary_gpt2)
        #     print("XLNet")
        #     pprint(summary_xlnet)
            
        #     audio.summarization = summary_total
        #     audio.save()
        #     print(f"Three bundle summarization time spent: {time()-t1:.2f}")
        #     return Response(summary_total, status=status.HTTP_200_OK)

        # except:
        #     return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
        
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def reset(self, request, *args, **kwargs):
        user = request.user
        audio = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not audio:
            return Response(status=status.HTTP_404_NOT_FOUND)
        audio = audio[0]
        try:
            audio.is_summarized = False
            audio.model_type = False
            audio.num_sentences = 0
            audio.summarization = None
            audio.save()
            return Response(f"{audio} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def resetQuiz(self, request, *args, **kwargs):
        print("recieved audio quiz reset request")
        user = request.user
        audio = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not audio:
            return Response(status=status.HTTP_404_NOT_FOUND)
        audio = audio[0]
        try:
            audio.quiz = None
            audio.save()
            return Response(f"{audio} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)

    '''
    Call this endpoint to fetch Quiz data
    URL: api/<int: collection_id>/audio/<int: audio_id>/quiz/
    
    Parameters to POST:
    "task":  "Question_Ans" | "QA_pair_gen" | "Question_gen"
    "based_text": "summ" | "full"
    "question": this parameter is especially needed for Question_Ans
    '''
    @action(methods=['POST'], detail = True, permission_classes = [IsAuthenticated])
    def quiz(self, request, *args, **kwargs):
        print("recieved quiz video request")
        t1 = time()
        user = request.user
        video = Audio.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not video:
            return Response(status=status.HTTP_404_NOT_FOUND)
        video = video[0]
        task = request.data.get('task', 'QA_pair_gen')
        based_text = request.data.get('based_text', 'summ')
        question = request.data.get('question', None)
        try:
            video.is_processing = True
            video.save()
            Quiz = quiz_generation.Quiz_generation(loads(video.summarization), video.audioText, based_text=based_text)
            res = Quiz.generate(task, question=question)       # question parameter can be modified if need
            
            video.is_processing = False
            video.quiz = dumps(res)
            video.save()
            print(f"create time spent: {time()-t1:.2f}")
            return Response(res, status=status.HTTP_200_OK)
        except:
            return Response("Quiz generation FAILED", status = status.HTTP_400_BAD_REQUEST)
        
   
class TextViewSet(viewsets.ModelViewSet):

    serializer_class = TextSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        return Text.objects.filter(Q(collection=self.kwargs['collection_pk']) & Q(collection__owner=user.pk))
    
    '''
    When method=="POST", following fields are required:
        model (if None, default: "Bert"),
        num_sentence (if None, default: None),
        max_sentence (if None, default: 20)
        default: set to 1 if this is the default summarization (if None, default: 0),
    URL: api/<int: collection_id>/text/<int: text_id>/summary_begin/
    '''
    @action(methods=['POST'],detail=True, permission_classes = [IsAuthenticated])
    def summary_begin(self, request, *args, **kwargs):
        print("recieved summarize request")
        
        t1 = time()
        user = request.user
        text = Text.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        
        if not text:
            return Response(status=status.HTTP_404_NOT_FOUND)
        text = text[0]
        if not text.text:
            return Response("Cannot find the Text for this text", status=status.HTTP_400_BAD_REQUEST)
        if text.is_processing:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            text.is_processing = True
            text.save()
            
            default = request.data.get('default', 0)
            if default:
                model = "XLNet"
            else:
                model = request.data.get('model', "Bert")
            
            num_sentence = request.data.get('num_sentence', None)
            if num_sentence is not None:
                num_sentence = int(num_sentence)
            max_sentence = int(request.data.get('max_sentence', 20))
            #TODO
            summary, num_sentence = speech_to_text.summarize(text.text, loads(text.transcript), model=model, num_sentence=num_sentence, max_sentence=max_sentence)
            pprint(summary)
            
            if default:
                Quiz = quiz_generation.Quiz_generation(summary, text.text, based_text="summ")
                res = Quiz.generate("QA_pair_gen", question=None)       # question parameter can be modified if need
                text.quiz = dumps(res)
            
            with transaction.atomic():
                text.model_type = model
                text.num_sentences = num_sentence
                text.summarization = dumps(summary)
                text.is_summarized = True
                text.is_processing = False
                text.save()
                print(f"Individual {model} summarization  time spent: {time()-t1:.2f}")
                print(model)
                text.save()
                
                return Response(summary, status=status.HTTP_200_OK)
        except:
            text.is_processing = False
            text.save()
            return Response("Fail to summarize", status=status.HTTP_400_BAD_REQUEST)
        
    '''
    Call this endpoint to delete a list of texts under one collection
    URL: api/<int: collection_id>/texts/delete_list_texts/
    '''
    @action(methods=['POST'],detail=False, permission_classes=[IsAuthenticated])
    def delete_list_texts(self, request, *args, **kwargs):
        print("recieved delete list texts request")
        user = request.user
        texts_to_delete = request.data.get('list_id', None)
        if not texts_to_delete:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        print(texts_to_delete)
        for pk in texts_to_delete:
            text = get_object_or_404(Text, pk=pk, collection__owner=user.pk)
            self.perform_destroy(text)
                 
        return Response({"list_id": texts_to_delete, 'remaining_size': user.userprofile.remaining_size})
    
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def reset(self, request, *args, **kwargs):
        print("recieved reset text request")
        user = request.user
        text = Text.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not text:
            return Response(status=status.HTTP_404_NOT_FOUND)
        text = text[0]
        try:
            text.is_summarized = False
            text.model_type = False
            text.num_sentences = 0
            text.summarization = None
            text.save()
            return Response(f"{text} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['GET'],detail=True, permission_classes=[IsAuthenticated])
    def resetQuiz(self, request, *args, **kwargs):
        print("recieved text quiz reset request")
        user = request.user
        text = Text.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not text:
            return Response(status=status.HTTP_404_NOT_FOUND)
        text = text[0]
        try:
            text.quiz = None
            text.save()
            return Response(f"{text} RESET success", status=status.HTTP_200_OK)
        except :
            return Response("Fail to reset", status=status.HTTP_400_BAD_REQUEST)
        
    
    '''
    Call this endpoint to fetch Quiz data
    URL: api/<int: collection_id>/text/<int: text_id>/quiz/
    
    Parameters to POST:
    "task":  "Question_Ans" | "QA_pair_gen" | "Question_gen"
    "based_text": "summ" | "full"
    "question": this parameter is especially needed for Question_Ans
    '''
    @action(methods=['POST'], detail = True, permission_classes = [IsAuthenticated])
    def quiz(self, request, *args, **kwargs):
        print("recieved quiz text request")
        t1 = time()
        user = request.user
        text = Text.objects.filter(Q(pk=self.kwargs['pk']) & Q(collection__owner=user.pk))
        if not text:
            return Response(status=status.HTTP_404_NOT_FOUND)
        text = text[0]
        task = request.data.get('task', 'QA_pair_gen')
        based_text = request.data.get('based_text', 'summ')
        question = request.data.get('question', None)
        if text.summarization == None:
            print("this is aaa")
            return Response({'Message':"Summarization Can't be empty"}, status = 204)
        try:
            text.is_processing = True
            text.save()
            Quiz = quiz_generation.Quiz_generation(loads(text.summarization), text.text, based_text=based_text)
            res = Quiz.generate(task, question=question)       # question parameter can be modified if need
            
            text.is_processing = False
            text.quiz = dumps(res)
            text.save()
            print(f"create time spent: {time()-t1:.2f}")
            return Response(res, status=status.HTTP_200_OK)
        except:
            text.is_processing = False
            text.save()
            print("this is reached")
            return Response({'Message':"Quiz Generation Failed"},status = status.HTTP_400_BAD_REQUEST) 
    
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
        
        # this simply used for test purpose
        user = request.user
        video = Video.objects.filter(collection__owner=user.pk)[0]
        print(video)
        d = { 'username': video.collection.owner.first_name, 
                        'mediaType': video.__class__.__name__.lower(), 
                        'mediaName': video.title,
                        'collection': video.collection.name,
                        'MEDIA_URL': settings.MEDIA_URL,
                        'TO': video.collection.owner.email}
        print(d)
        x = send_email(d)
        
        return Response({'remaining_size': request.user.userprofile.remaining_size})

'''
    Description: when summary is ready, this will be automatically called to send notification email to user's email
'''

# This functionality is moved to .tasks handled by Celery in production
def send_email(d):

    email_subject = 'You Default Summarization Is Ready at Briefly-AI!'
    
    # {{ username }}
    # {{ mediaType }}
    # {{ mediaName }}
    # {{ collection }}
    
    plaintext = render_to_string('email.txt', d)
    htmly     = render_to_string('email.html', d)
    from_email, to = settings.EMAIL_HOST_USER, str(d['TO'])
    send_mail(
        email_subject,
        plaintext,
        from_email,
        [to],
        html_message=htmly,
        fail_silently=False
    )
    
    