from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .speech_to_text_celery import amazon_transcribe, load_json_output, read_output, summarize
from json import dumps
from .quiz_generation import Quiz_generation
from celery import chain, signature, Task
from summarizer import Summarizer, TransformerSummarizer
from .models import Collection, Video, Audio, Text
from django.db import transaction

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

@shared_task(time_limit=600)
def pop_quiz_celery(tuple_args, based_text = "summ", type_task = "QA_pair_gen", question=None):
    summary, audioText, video_info = tuple_args
    Quiz = Quiz_generation(summary, audioText, based_text=based_text)
    res = Quiz.generate(type_task, question=question)
    
    video = retrieve_media(video_info)
    video.quiz = dumps(res)
    video.save()
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
    video.is_processing = False
    video.save()
    
    return None
