import time
import boto3
import json
import datetime
from .sentence_process import SentenceHandler
import random
# from django.conf import settings

AWS_ACCESS_KEY_ID = 'AKIA4Q6A67QESQQAFLMF'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'briefly41'

transcribe = boto3.client('transcribe', region_name='us-west-1', aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)
s3 = boto3.resource('s3', region_name='us-west-1', aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

def random_job_name_generator():
    rand_dig = 6
    extender = "-"
    for i in range(rand_dig):
        extender += str(random.randint(0,9))
    return extender
def check_job_name(job_name):
    '''
        delete duplicate trancribe job, avoid conflict
    '''
    job_verification = True
    
    # all the transcriptions 
    Queue_jobs = transcribe.list_transcription_jobs(Status='QUEUED', JobNameContains=job_name, MaxResults=100)
    in_progress_jobs = transcribe.list_transcription_jobs(Status='IN_PROGRESS', JobNameContains=job_name, MaxResults=100)

    current_jobs = [] 
    for job in Queue_jobs['TranscriptionJobSummaries'] + in_progress_jobs['TranscriptionJobSummaries']:
        job_title = job['TranscriptionJobName']
        # print(job_title)
        current_jobs.append(job_title)
        if job_name == job_title:
            job_verification = False
            break
    if job_verification == False:
        while True:
            extention = random_job_name_generator()
            if job_name + extention not in current_jobs:
                job_name += extention
                break

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

def get_sentence_words_count(sentences):
    count = 0
    words_counter = {}
    for index, sentence in enumerate(sentences):
        words_count = len(sentence.split(' '))
        words_counter[count] = sentence
        count += words_count
    return words_counter

def read_output(data):
    '''
        data: the json output of aws transcribe job
    ''' 
    items = data['results']['items']
    lines = []
    line = ''
    time = 0
    endtime = 0

    #extract the complete transcript out of returned json
    complete_transcript = data['results']['transcripts'][0]['transcript']

    #process the sentence and split them 
    sentence_handler = SentenceHandler()
    sentences = sentence_handler(complete_transcript, 40, 600)
    word_count = get_sentence_words_count(sentences)
    # print(len(' '.join(sentences).split(' ')))
    #constant to track progress
    couter = 0
    total_sentence = len(sentences)
    sentence_processed = 0
    # loop through all elements
    for item in items:
        content = item['alternatives'][0]['content']

        #skip the punctuation mark
        if item['type'] != 'punctuation':
            #if the word mark exist
            if couter in word_count:
                lines.append({'line': word_count[couter],'time': item['end_time']})
                sentence_processed += 1
            couter += 1

        # # if it's starting time
        # if item['type'] == 'punctuation' and content == '.' and len(line) > 40:
        #     line = line + content
        #     lines.append({'line':line, 'time':time})
        #     time = endtime
        #     line = ''
        # else:
        #     if item['type'] != 'punctuation':
        #         line = line + ' ' + content
        #         endtime = item['start_time']
        #     else:
        #         line = line + content
        
    if sentence_processed < total_sentence:
        # usually this won't be reached, will implement more safety later
        print("alert!!")

    # sort the results by the time
    sorted_lines = sorted(lines,key=lambda k: float(k['time']))

    # write into the .txt file
    audio_script_timed = {}
    for line_data in sorted_lines:
        timestamp = '[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + ']'
        audio_script_timed[line_data['line']] = [timestamp, float(line_data['time'])]
    print(audio_script_timed)
    
    return audio_script_timed, complete_transcript


from summarizer import Summarizer, TransformerSummarizer


# responsible for different model summarization
def summarize(body_transcript, audio_text_timed, num_sentence=None, max_sentence=20, model='Bert'):
    #initialize sentence handler
    sentence_handler = SentenceHandler()
    result = ''

    if model == 'Bert':
        Bert = Summarizer()
        #compute optiaml split
        if num_sentence == None:
            num_sentence = Bert.calculate_optimal_k(body_transcript, k_max=max_sentence)

        result = Bert(body_transcript, num_sentences=num_sentence)
    
    else:
        if model == 'GPT-2':
            GPT2_model = TransformerSummarizer(transformer_type="GPT2",transformer_model_key="gpt2-medium")
            #compute optimal split
            if num_sentence == None:
                num_sentence = GPT2_model.calculate_optimal_k(body_transcript, k_max=max_sentence)
            
            result = GPT2_model(body_transcript, num_sentences=num_sentence)
            
        elif model == 'XLNet':
            XLNet = TransformerSummarizer(transformer_type="XLNet",transformer_model_key="xlnet-base-cased")
            #compute optimal split
            if num_sentence == None:
                num_sentence = XLNet.calculate_optimal_k(body_transcript, k_max=max_sentence)

            result = XLNet(body_transcript, min_length=60)

    # split the result into timestamped pieces
    sentence_dict = {}
    
    for sentence in sentence_handler(result, 40, 600):
        timestamp, time_in_sec = audio_text_timed[sentence]
        sentence_dict[time_in_sec] = [sentence, timestamp]
    
    return sentence_dict


#url = amazon_transcribe('sample.mp4', 'Collection1', 9)

# data = load_json_output('s3://briefly41/static/Collection1/video/9/sample.json')
# audio_script_timed , complete_transcript = read_output(data)
# result = summarize(complete_transcript, audio_script_timed, num_sentence=None, max_sentence=20, model='XLNet')
# print(result)



# body = '''
#    Drugmaker Pfizer said Thursday it is seeing waning immunity from its coronavirus vaccine and says it is picking up its efforts to develop a booster dose that will protect people from variants. It said it would seek emergency use authorization from the US Food and Drug Administration for a booster dose in August after releasing more data about how well a third dose of vaccine works. But in an unusual move, two top federal agencies said Americans don't need boosters yet and said it was not up to companies alone to decide when they might be needed Hours after Pfizer issued its statement, the FDA and Centers for Disease and Control issued a joint statement saying Americans do not need booster shots yet. "Americans who have been fully vaccinated do not need a booster shot at this time," they said. Pfizer and its partner BioNTech said evidence was building that people's immunity starts to wane after they have been vaccinated. The Pfizer vaccine requires two doses to provide full immunity. "As seen in real world data released from the Israel Ministry of Health, vaccine efficacy in preventing both infection and symptomatic disease has declined six months post-vaccination, although efficacy in preventing serious illnesses remains high," Pfizer said in a statement emailed to CNN. "Additionally, during this period the Delta variant is becoming the dominant variant in Israel as well as many other countries. These findings are consistent with an ongoing analysis from the Companies' Phase 3 study," it added."While protection against severe disease remained high across the full six months, a decline in efficacy against symptomatic disease over time and the continued emergence of variants are expected. Based on the totality of the data they have to date, Pfizer and BioNTech believe that a third dose may be beneficial within 6 to 12 months following the second dose to maintain highest levels of protection." It gave no further details. US government officials have stressed that fully vaccinated people have a low risk of infection, even from the Delta or B.1.617.2 variant, which is more transmissible than earlier lineages of the virus. Plus, several studies have indicated the mRNA vaccines made by Pfizer and Moderna confer longterm protection. "FDA, CDC, and NIH (the National Institutes of Health) are engaged in a science-based, rigorous process to consider whether or when a booster might be necessary. This process takes into account laboratory data, clinical trial data, and cohort data -- which can include data from specific pharmaceutical companies, but does not rely on those data exclusively," they added. It was a clear message to Pfizer, which has been hinting at the need for a booster shot for months. "We continue to review any new data as it becomes available and will keep the public informed. We are prepared for booster doses if and when the science demonstrates that they are needed," the CDC and FDA said in the statement. "The United States is fortunate to have highly effective vaccines that are widely available for those aged 12 and up. People who are fully vaccinated are protected from severe disease and death, including from the variants currently circulating in the country such as Delta," the statement continued. "People who are not vaccinated remain at risk. Virtually all COVID-19 hospitalizations and deaths are among those who are unvaccinated. We encourage Americans who have not yet been vaccinated to get vaccinated as soon as possible to protect themselves and their community." Israel's health ministry said in a statement earlier this week that it had seen efficacy of Pfizer's vaccine drop from more than 90% to about 64% as the B.1.617.2 or Delta variant spread. Pfizer said research showed booster doses of its vaccine, developed with BioNTech, produced levels of neutralizing antibodies that are five to 10 times higher than what's produced after two doses. "The companies expect to publish more definitive data soon as well as in a peer-reviewed journal and plan to submit the data to the FDA, EMA (European Medicines Agency) and other regulatory authorities in the coming weeks," Pfizer said in a statement. And it said it's also developing a new formulation for a booster dose that may more thoroughly protect people from new variants. "While Pfizer and BioNTech believe a third dose of BNT162b2 has the potential to preserve the highest levels of protective efficacy against all currently known variants including Delta, the companies are remaining vigilant and are developing an updated version of the Pfizer-BioNTech COVID-19 vaccine that targets the full spike protein of the Delta variant," the company said. Current vaccines target just a piece of the spike protein -- the part of the virus it uses to attach to cells. "The first batch of the mRNA for the trial has already been manufactured at BioNTech's facility in Mainz, Germany. The Companies anticipate the clinical studies to begin in August, sub
# '''
# sentence_handler = SentenceHandler()
# sentences = sentence_handler(body, 40, 600)

# model = TransformerSummarizer(transformer_type="XLNet",transformer_model_key="xlnet-base-cased")
# res = model.calculate_optimal_k(body, k_max=20)
# full = model(body, num_sentences=res)
# print(type(full))
# for i in sentence_handler(full, 40, 600):
#     if i in sentences:
#         print(i)
#         print('true')
#     else:
#         print('false')























'''
#everything below is experimenting, will be modified later
# import sumy

# from sumy.parsers.plaintext import PlaintextParser
# from sumy.nlp.tokenizers import Tokenizer
# from sumy.summarizers.lex_rank import LexRankSummarizer
# from sumy.summarizers.lsa import LsaSummarizer
# from sumy.summarizers.luhn import LuhnSummarizer
# from sumy.summarizers.kl import KLSummarizer

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