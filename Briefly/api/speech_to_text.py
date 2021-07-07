import time
import boto3
import pandas as pd
import json
import datetime
# from django.conf import settings

AWS_ACCESS_KEY_ID = 'AKIA4Q6A67QESQQAFLMF'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'briefly41'

transcribe = boto3.client('transcribe', region_name='us-west-1', aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)
s3 = boto3.resource('s3', region_name='us-west-1', aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

def check_job_name(job_name):
    '''
        delete duplicate trancribe job, avoid conflict
    '''
    job_verification = True
    
    # all the transcriptions
    existed_jobs = transcribe.list_transcription_jobs()
    
    for job in existed_jobs['TranscriptionJobSummaries']:
        if job_name == job['TranscriptionJobName']:
            job_verification = False
            break

    if job_verification == False:
        transcribe.delete_transcription_job(TranscriptionJobName=job_name)

    return job_name

# AWS speech to text
def amazon_transcribe(audio_file_name, collection_name, video_id,  max_speakers = -1):
    '''
        calling aws transcribe service
        input:
            audio_file_name:  the name of transcribing file name (String) ex. 'content.mp4'
            collection_name:  the name of that particular collection (String) ex. 'Collection3'
            video_id: the id of that particular video/audio, could be in integer or string
            ignore max_speakers, we may use it in the future
        return:
            the output json s3 url, to store in database, and use it to access the actural transcription. 
    '''
    if max_speakers > 10:
        raise ValueError("Maximum detected speakers is 10.")

    target_key = "static/" + collection_name + "/video/" + str(video_id)+ "/"
    job_uri = "s3://"+ AWS_STORAGE_BUCKET_NAME + "/" + target_key + audio_file_name 
    job_name = (audio_file_name.split('.')[0]).replace(" ", "")
    
    # check if name is taken or not
    job_name = check_job_name(job_name)
    
    if max_speakers != -1:
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat=audio_file_name.split('.')[1],
            LanguageCode='en-US',
            Settings = {'ShowSpeakerLabels': True,
                    'MaxSpeakerLabels': max_speakers
                    },
            OutputBucketName= AWS_STORAGE_BUCKET_NAME,
            OutputKey= target_key,
        )
    else: 
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat=audio_file_name.split('.')[1],
            LanguageCode='en-US',
            OutputBucketName= AWS_STORAGE_BUCKET_NAME ,
            OutputKey= target_key,

        )    
    
    while True:
        result = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if result['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        time.sleep(10)
        print('transcribing...')
    #return the output json bucket key if success, so the data could be directly downloaded from s3 bucket
    if result['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
        return result['TranscriptionJob']['Transcript']['TranscriptFileUri']
    return None

  
def load_json_output(url):
    '''
        take in s3 url output by amazon_transcribe(),
        return the raw json data to display in front end
    '''
    #get json file location from url
    file_location = url.split(AWS_STORAGE_BUCKET_NAME+'/')[1]
    #print(file_location)
    content_object = s3.Object(AWS_STORAGE_BUCKET_NAME, file_location)
    file_content = content_object.get()['Body'].read().decode('utf-8')
    data = json.loads(file_content)
    return data

def read_output(data):
    '''
        data: the json output of aws transcribe job
    ''' 
    items = data['results']['items']
    lines = []
    line = ''
    time = 0
    endtime = 0
    complete_transcript = data['results']['transcripts'][0]['transcript']
    # loop through all elements
    for item in items:
        content = item['alternatives'][0]['content']
        print(content)
        print(item)

        # if it's starting time
        if item['type'] == 'punctuation' and content == '.' and len(line) > 10:
            line = line + content
            lines.append({'line':line, 'time':time})
            time = endtime
            line = ''
        else:
            if item['type'] != 'punctuation':
                line = line + ' ' + content
                endtime = item['start_time']
            else:
                line = line + content
        
    if len(line):
        lines.append({'line': line,'time': time})

    # sort the results by the time
    sorted_lines = sorted(lines,key=lambda k: float(k['time']))

    # write into the .txt file
    for line_data in sorted_lines:
        line_data['timestamp'] = '[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + ']'
    return sorted_lines, complete_transcript


# amazon_transcribe('test1.mp4', 'Collection1', 8)
'''
data = load_json_output('https://s3.us-west-1.amazonaws.com/briefly41/static/Collection1/video/1/sample.json')
_ , complete_transcript = read_output(data)
'''

#everything below is experimenting, will be modified later
import sumy

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.summarizers.kl import KLSummarizer

'''
print(complete_transcript)

print(" ")

sentence_count = 4
# Initializing the parser
my_parser = PlaintextParser.from_string(complete_transcript, Tokenizer('english'))

#LexRank 
lex_rank_summarizer = LexRankSummarizer()
lexrank_summary = lex_rank_summarizer(my_parser.document,sentences_count=sentence_count)
# Printing the summary
for sentence in lexrank_summary:
    print(sentence)
print(" ")

#LSA 
# creating the summarizer
lsa_summarizer=LsaSummarizer()
lsa_summary= lsa_summarizer(my_parser.document,sentence_count)

# Printing the summary
for sentence in lsa_summary:
    print(sentence)
print(" ")

#Luhn
#  Creating the summarizer
luhn_summarizer=LuhnSummarizer()
luhn_summary=luhn_summarizer(my_parser.document,sentences_count=sentence_count)

# Printing the summary
for sentence in luhn_summary:
    print(sentence)
print(" ")
#KL-sum
# Instantiating the  KLSummarizer
kl_summarizer=KLSummarizer()
kl_summary=kl_summarizer(my_parser.document,sentences_count=sentence_count)

# Printing the summary
for sentence in kl_summary:
    print(sentence)
'''