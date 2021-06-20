import time
import boto3
import pandas as pd
import json
import datetime

transcribe = boto3.client('transcribe', region_name='us-west-1', aws_access_key_id='AKIA4Q6A67QESQQAFLMF',
         aws_secret_access_key= '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')

def check_job_name(job_name):
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
def amazon_transcribe(audio_file_name, max_speakers = -1):

    if max_speakers > 10:
        raise ValueError("Maximum detected speakers is 10.")

    job_uri = "s3://briefly41/static/Collection1/video/1/" + audio_file_name 
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
            OutputBucketName= 'briefly41',
            OutputKey= 'static/Collection1/video/1/',
        )
    else: 
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat=audio_file_name.split('.')[1],
            LanguageCode='en-US',
            OutputBucketName= 'briefly41',
            OutputKey= 'static/Collection1/video/1/',
            Settings = {'ShowSpeakerLabels': True},
        )    
    
    while True:
        result = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if result['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        time.sleep(10)
        print('transcribing...')
    if result['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
        data = pd.read_json(result['TranscriptionJob']['Transcript']['TranscriptFileUri'])
    return result

  
def read_output(data):
    '''
        data: the json output of aws transcribe job
    ''' 
    items = data['results']['items']
    lines = []
    line = ''
    time = 0
    endtime = 0
    print(data['results']['transcripts'][0]['transcript'])
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
        line = '[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + '] ' +  ': ' + line_data.get('line')
    
    return sorted_lines