# from youtube_transcript_api import YouTubeTranscriptApi
# from pytube import YouTube
# import xml.etree.ElementTree as ET
# import html
# from sentence_process import SentenceHandler
# from punctuator import Punctuator
# import datetime


# def get_video_Transcript(url):
#     video_id = url.split("=")[-1]
#     transcript = YouTubeTranscriptApi.get_transcript(video_id)
#     yt = YouTube(url)
    
#     file = yt.captions['.en'] if '.en' in yt.captions else yt.captions['a.en']
#     tree = ET.fromstring(file.xml_captions)
#     notags = ET.tostring(tree, encoding='unicode', method='text')
#     notags = html.unescape(notags)
#     notags = notags.replace('\n', ' ')
#     notags = ' '.join(notags.split())
#     video = None
#     video = yt.streams.filter(progressive=True, file_extension='mp4', res='720p').first()
#     if not video:
#         video = yt.streams.filter(progressive=True, file_extension='mp4', res='480p').first()
#     elif not video:
#         video = yt.streams.filter(progressive=True, file_extension='mp4', res='360p').first()
#     elif not video:
#         video = yt.streams.filter(progressive=True, file_extension='mp4', res='240p').first()
#     elif not video:
#         video = yt.streams.filter(progressive=True, file_extension='mp4', res='144p').first()
    
#     #instance = retrieve_media(video_info)
    
#     # for Allen: change transcript format based on your defined format, start here
#     print(transcript)
#     # end
#     # instance.transcript = dumps(transcript)     
#     # instance.audioText = notags
    
#     #video_path = video.download()
#     # video_file = open(video_path, 'rb')
#     # djangofile = File(video_file)
    
#     # instance.video = djangofile
#     # instance.fileSize = djangofile.size
    
    
#     # profile = UserProfile.objects.select_for_update().filter(user=user_id)[0]
#     # with transaction.atomic():
#     #     profile.remaining_size -= djangofile.size
#     #     profile.save()
        
#     # instance.save()
    
#     # video_file.close()
#     # os.remove(video_path)
#     return (notags, transcript)

# def get_sentence_words_count(sentences):
#     count = 0
#     words_counter = []
#     for index, sentence in enumerate(sentences):
#         words_count = len(sentence.split(' '))
#         words_counter.append([count, sentence])
#         count += words_count
#     return words_counter

# def process_transcript(transcript):
#     counter_trans = []
#     counter = 0
#     for sen in transcript:
#         counter += len(sen['text'].split(' '))
#         sen['word_count'] = counter
#         counter_trans.append(sen)

#     return counter_trans

# url = "https://www.youtube.com/watch?v=THxCy-6EnQM"
# (notags, transcript) = get_video_Transcript(url)


# print('checkpoint')
# p = Punctuator('puntuator_model/model.pcl')
# result = p.punctuate(notags)
# # print(result)
# sentence_handler = SentenceHandler()
# sentences = sentence_handler(result, 5, 600)
# print(sentences)


# sentence_count = get_sentence_words_count(sentences)
# term_count = process_transcript(transcript)
# lines = [] 
# total_time = transcript[-1]['start'] + transcript[-1]['duration']

# word_index = 0
# sentence_index = 0
# sentence_num = len(sentence_count)
# for term in term_count:
#     if sentence_index >= sentence_num:
#         break

#     target_sen = sentence_count[sentence_index]
   
#     while term['word_count'] >= target_sen[0] and sentence_index < sentence_num:
#         lines.append({'id': sentence_index, 'sentence': target_sen[1],'time': term['start'] })
#         sentence_index += 1
#         if sentence_index >= sentence_num:
#             break
#         target_sen = sentence_count[sentence_index]
    
# if sentence_index < sentence_num - 1:
#     print("alert!! timestamp error, please check speech_to_text file read output function")

# for line_data in lines:
#     line_data['displayed_time'] = '[' + str(datetime.timedelta(seconds=int(round(float(line_data['time']))))) + ']'
#     line_data['time'] = float(line_data['time']) / float(total_time)
# paperContent = pdfplumber.open(paperFilePath).pages
# showPaperSummary(paperContent)
# print(lines)

import openai

def GPT3(content):
    tldr_tag = "\ntl;dr:"
    openai.organization = 'org-VFp4IKfUIwVwgpZ77TGtjN2T'
    openai.api_key = "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"
    engine_list = openai.Engine.list() 
    
    text = content + tldr_tag
    response = openai.Completion.create(
        engine="davinci",
        prompt=text,
        temperature=0.3,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0.1,
        presence_penalty=0.1,
        stop=["\n"]
    )
    print(response["choices"][0]["text"])

