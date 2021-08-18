from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .speech_to_text_celery import amazon_transcribe, load_json_output, read_output, summarize
from json import dumps
from .quiz_generation import Quiz_generation
from celery import chain, signature, Task, current_app
from summarizer import Summarizer, TransformerSummarizer
from .models import Video, Audio, Text
from social_login.models import UserProfile
from django.db import transaction
from .Question_gen.pipelines import pipeline
from youtube_transcript_api import YouTubeTranscriptApi
import xml.etree.ElementTree as ET
import urllib.request
import html
from pytube import YouTube
import os
from django.core.files import File
from .sentence_process import SentenceHandler
from punctuator import Punctuator
import datetime

class GPT2Task(Task):
    _model = None
    
    @property
    def model(self):
        if self._model is None:
            self._model = TransformerSummarizer(transformer_type="GPT2",transformer_model_key="gpt2-medium")
        return self._model
    
class BertTask(Task):
    _model = None
    
    @property
    def model(self):
        if self._model is None:
            self._model = Summarizer()
        return self._model
    
class XLNetTask(Task):
    _model = None
    
    @property
    def model(self):
        if self._model is None:
            self._model = TransformerSummarizer(transformer_type="XLNet",transformer_model_key="xlnet-base-cased")
        return self._model

class QuizTask(Task):
    _model = None

    @property
    def model(self):
        if self._model is None:
            self._model = pipeline("question-generation", model="valhalla/t5-small-qg-prepend", qg_format="prepend")
        return self._model


def retrieve_media(video_info):
    if video_info[0] == 'video':
        return Video.objects.filter(pk=video_info[1])[0]
    elif video_info[0] == 'audio':
        return Audio.objects.filter(pk=video_info[1])[0]
    elif video_info[0] == 'text':
        return Text.objects.filter(pk=video_info[1])[0]


@shared_task(time_limit=60)
def send_email_celery(d):
    email_subject = 'You Default Summarization Is Ready at Briefly-AI!'
    
    # {{ username }}
    # {{ mediaType }}
    # {{ mediaName }}
    # {{ collection }}
    
    plaintext = render_to_string('email.txt', d)
    htmly     = render_to_string('email.html', d)
    from_email, to = settings.EMAIL_HOST_USER, d['TO']
    send_mail(
        email_subject,
        plaintext,
        from_email,
        [to],
        html_message=htmly,
        fail_silently=False
    )
    return None

@shared_task(time_limit=1200)
def amazon_transcribe_celery(video_info, audio_file_name, collection_name, type, video_id,  max_speakers = -1):
    # when entering the queue, video.is_processing has been set to True
    
    print("amazon transcribe celery been called")
    transcribe =  amazon_transcribe(audio_file_name, collection_name, type, video_id,  max_speakers = -1)
    data = load_json_output(transcribe)
    transcript, audioText, _ = read_output(data)
    
    video = retrieve_media(video_info)
    video.transcript = dumps(transcript)
    video.audioText = audioText
    video.save()
    
    return (audioText, transcript, video_info)

@shared_task(base=BertTask, time_limit=600)
def Bert_summarize_celery(tuple_args, num_sentence=None, max_sentence = 20):
    audioText, transcript, video_info = tuple_args
    summary, num_sentence = summarize(audioText, transcript, model = "Bert", instance = Bert_summarize_celery.model, num_sentence=num_sentence, max_sentence = max_sentence)
    
    video = retrieve_media(video_info)
    video.model_type = "Bert"
    video.num_sentences = num_sentence
    video.summarization = dumps(summary)
    video.is_summarized = True
    video.save()
    return (summary, audioText, video_info)

@shared_task(base=GPT2Task, time_limit=600)
def GPT2_summarize_celery(tuple_args, num_sentence=None, max_sentence = 20):
    audioText, transcript, video_info = tuple_args
    summary, num_sentence = summarize(audioText, transcript, model = "GPT-2", instance = GPT2_summarize_celery.model, num_sentence=num_sentence, max_sentence = max_sentence)
    
    video = retrieve_media(video_info)
    video.model_type = "GPT-2"
    video.num_sentences = num_sentence
    video.summarization = dumps(summary)
    video.is_summarized = True
    video.save()
    return (summary, audioText, video_info)

@shared_task(base=XLNetTask, time_limit=600)
def XLNet_summarize_celery(tuple_args, num_sentence=None, max_sentence = 20):
    audioText, transcript, video_info = tuple_args 
    summary, num_sentence = summarize(audioText, transcript, model = "XLNet", instance = XLNet_summarize_celery.model, num_sentence=num_sentence, max_sentence = max_sentence)
    
    video = retrieve_media(video_info)
    video.model_type = "XLNet"
    video.num_sentences = num_sentence
    video.summarization = dumps(summary)
    video.is_summarized = True
    video.save()
    return (summary, audioText, video_info)

'''This functionality has been removed to another server on another instance'''
@shared_task(base=QuizTask, time_limit=600)
def pop_quiz_celery(tuple_args, based_text = "summ", type_task = "QA_pair_gen", question=None):
    print('starting process quiz...')
    summary, audioText, video_info = tuple_args
    Quiz = Quiz_generation(summary, audioText, based_text=based_text)
    Quiz = Quiz_generation(summary, audioText, based_text=based_text, model = pop_quiz_celery.model)
    res = Quiz.generate(type_task, question=question)
    
    #video = retrieve_media(video_info)
    #video.quiz = dumps(res)
    #video.save()
    return res

# transcribe + XLNet summarize + pop quiz + send email
@shared_task(time_limit=1200)
def chain_initial_process_video(video_info, d):
    video = retrieve_media(video_info)
    video_path = video.video.name.split('/')
    video_name, video_id, type, collection_name = video_path[3], video_path[2],video_path[1], video_path[0]
    chain = (amazon_transcribe_celery.s(video_info, video_name, collection_name, type, video_id) |
            XLNet_summarize_celery.s(num_sentence=None, max_sentence = 20) |
            pop_quiz_celery.s(based_text = "summ", type_task = "QA_pair_gen", question=None)
            )().get(timeout=7200)
    
    send_email_celery.delay(d)
    video = retrieve_media(video_info)
    video.quiz = dumps(chain)
    video.is_processing = False
    video.save()
    
    return None

def get_sentence_words_count(sentences):
    count = 0
    words_counter = []
    for index, sentence in enumerate(sentences):
        words_count = len(sentence.split(' '))
        words_counter.append([count, sentence])
        count += words_count
    return words_counter

def process_transcript(transcript):
    counter_trans = []
    counter = 0
    for sen in transcript:
        counter += len(sen['text'].split(' '))
        sen['word_count'] = counter
        counter_trans.append(sen)

    return counter_trans

@shared_task
def get_video_Transcript(video_info, url, video_id, user_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    yt = YouTube(url)
    
    file = yt.captions['.en'] if '.en' in yt.captions else yt.captions['a.en']
    tree = ET.fromstring(file.xml_captions)
    notags = ET.tostring(tree, encoding='unicode', method='text')
    notags = html.unescape(notags)
    notags = notags.replace('\n', ' ')
    notags = ' '.join(notags.split())
    video = None
    video = yt.streams.filter(progressive=True, file_extension='mp4', res='720p').first()
    if not video:
        video = yt.streams.filter(progressive=True, file_extension='mp4', res='480p').first()
    elif not video:
        video = yt.streams.filter(progressive=True, file_extension='mp4', res='360p').first()
    elif not video:
        video = yt.streams.filter(progressive=True, file_extension='mp4', res='240p').first()
    elif not video:
        video = yt.streams.filter(progressive=True, file_extension='mp4', res='144p').first()
    
    instance = retrieve_media(video_info)
    
    # for Allen: change transcript format based on your defined format, start here

    #the original audiotext does not have puntuation, this two lines will add punturation in for you
    p = Punctuator('puntuator_model/model.pcl')
    result = p.punctuate(notags)
    # sentence piece the whole audiotext
    sentence_handler = SentenceHandler()
    sentences = sentence_handler(result, 5, 600)

    sentence_count = get_sentence_words_count(sentences)
    term_count = process_transcript(transcript)
    lines = [] 
    total_time = transcript[-1]['start'] + transcript[-1]['duration']

    sentence_index = 0
    sentence_num = len(sentence_count)
    for term in term_count:
        if sentence_index >= sentence_num:
            break

        target_sen = sentence_count[sentence_index]
    
        while term['word_count'] >= target_sen[0] and sentence_index < sentence_num:
            lines.append({'id': sentence_index, 'sentence': target_sen[1],'time': term['start'] })
            sentence_index += 1
            if sentence_index >= sentence_num:
                break
            target_sen = sentence_count[sentence_index]
        
    if sentence_index < sentence_num - 1:
        print("alert!! timestamp error, please check speech_to_text file read output function")

    for line_data in lines:
        line_data['displayed_time'] = '[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + ']'
        line_data['time'] = float(line_data['time']) / float(total_time)

    # end

    instance.transcript = dumps(lines)     
    instance.audioText = result
    
    video_path = video.download()
    video_file = open(video_path, 'rb')
    djangofile = File(video_file)
    
    instance.video = djangofile
    instance.fileSize = djangofile.size
    
    
    profile = UserProfile.objects.select_for_update().filter(user=user_id)[0]
    with transaction.atomic():
        profile.remaining_size -= djangofile.size
        profile.save()
        
    instance.save()
    
    video_file.close()
    os.remove(video_path)
    return (notags, transcript, video_info)

# download YouTube video + XLNet summarize + pop quiz + send email
@shared_task(time_limit=1200)
def chain_initial_process_video_youtube(video_info, url, video_id, user_id, d):
    video = retrieve_media(video_info)
    chain = (get_video_Transcript.s(video_info, url, video_id, user_id) |
            XLNet_summarize_celery.s(num_sentence=None, max_sentence = 20) |
            pop_quiz_celery.s(based_text = "summ", type_task = "QA_pair_gen", question=None)
            )().get(timeout=7200)
    
    send_email_celery.delay(d)
    video = retrieve_media(video_info)
    video.quiz = dumps(chain)
    video.is_processing = False
    video.save()
    
    return None