
# from Question_gen.pipelines import pipeline

# class quiz_generation:

#     task_list = ['Question_Ans', 'QA_pair_gen', 'Q_gen']

#     def __init__(self, summarization, full_body):
#         self.summarization = summarization
#         self.full_body = full_body
        
#     def generate(self, task, question=None):

#         if task not in self.task_list:
#             print(f'{task} does not exist.')
#             return None
#         if task == 'Question_Ans':
#             if question != None:
#                 nlp = pipeline("multitask-qa-qg")
#                 result = nlp({
#                     "question": question,
#                     "context": self.full_body
#                 })
#                 return result
#             else:
#                 print('please include the question.')
#                 return None
       
# full = '''The subway train in Zhengzhou, a city of five million in central China, was approaching its next station when the floodwaters began to rise ominously on the tracks. The passengers crowded forward as the water rose, submerging the cars at the rear first because they were deeper in the tunnel. As the water reached their waists, then chests, finally their necks, the passengers called emergency services or relatives. One gave her parents the details for accessing her bank account. Some cried. Others retched or fainted. After two hours, it became difficult to breathe in the congested air that remained in the cars. Ding Xiaopei, a radio host, was afraid to call her children, 13 and 4. What could she say? She posted a video that she thought might be her last message. “The water outside has reached this position,” she said, it having reached chest level, “and my mobile phone will soon run out of power.” “Please save us!” she wrote. The flood that inundated Line 5 of Zhengzhou’s subway on Tuesday added to the grim global toll extreme weather has taken already this year, with scorching heat in the Pacific Northwest, forest fires in Siberia, and flooding in Germany and Belgium. Although flooding is common in China, researchers have attributed the extreme weather sweeping the planet to the consequences of climate change. At least 25 died in and around Zhengzhou, the capital of Henan Province, including 12 people in the subway, according to officials who briefed journalists on Wednesday. Days of torrential rain that began on Sunday created scenes of destruction that suggested the death toll could rise much higher.'''
        