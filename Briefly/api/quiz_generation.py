from .Question_gen.pipelines import pipeline
from . import speech_to_text
import warnings
warnings.filterwarnings("ignore")

class Quiz_generation:

    '''
        summarization: summarized array with dict element computed by summarize function
        full_body: the full audio text
        based_text: 'summ' | 'full' which textual data quiz should be based on
    '''
    task_list = ['Question_Ans', 'QA_pair_gen', 'Question_gen']

    def __init__(self, summarization, full_body, based_text="summ", model = None):
        self.summarization = summarization
        self.full_body = full_body
        self.model = model
        if not summarization:
            self.based_text = 'full'
        else:
            self.based_text = based_text

    def abstract_summary(self, full_text):
        return speech_to_text.abstract_summary(full_text)
        
    def clean_answer(self, result, return_object=False):
        for pair in result:
            pair['answer'] = pair['answer'][6::]
        if return_object:
            return result
        return len(result)

    def generate(self, task, question=None, quiz_set='large'):

        if task not in self.task_list:
            print(f'{task} does not exist.')
            return None
        if task == 'Question_Ans':
            if question != None:
                nlp = pipeline("multitask-qa-qg")
                result = nlp({
                    "question": question,
                    "context": self.full_body
                })
                return result
            else:
                print('please include the question.')
                return None

        elif task == 'QA_pair_gen':
            print("generating...")
            #nlp = pipeline("question-generation", model="valhalla/t5-small-qg-prepend", qg_format="prepend")
            nlp = self.model
            quiz = []
            if self.based_text == 'summ':
                # print(self.summarization)
                count = 1
                for index, summary in enumerate(self.summarization):
                    # print(summary)
                    summary['quiz'] = nlp(summary['sentence'])
                    summary['count'] = count
                    count += self.clean_answer(summary['quiz'])

                    quiz.append(summary)
                print(quiz)
                return quiz

            elif self.based_text == 'full':
                result=None
                if quiz_set=='small':
                    summarzed_text = self.abstract_summary(self.full_body)
                    result = self.clean_answer(nlp(summarzed_text), return_object=True)
                elif quiz_set=='large':
                    result = self.clean_answer(nlp(self.full_body), return_object=True)
                else:
                    print("wrong quiz type")

                return result

        elif task == 'Question_gen':
            nlp = pipeline("e2e-qg")
            result = nlp(self.full_body)
            return result

# full = "The Olympic Games, which originated in ancient Greece as many as 3,000 years ago, were revived in the late 19th century and have become the world???s preeminent sporting competition. From the 8th century B.C. to the 4th century A.D., the Games were held every four years in Olympia, located in the western Peloponnese peninsula, in honor of the god Zeus. The first modern Olympics took place in 1896 in Athens, and featured 280 participants from 12 nations, competing in 43 events. Since 1994, the Summer and Winter Olympic Games have been held separately and have alternated every two years. The 2020 Summer Olympics, delayed one year because of the COVID-19 pandemic, will be held from July 23 to August 8, 2021 in Tokyo, Japan."
# # full2 = "The curvature of this equation is the most important point of differential equation"
# # summ = [{'id': 1, 'sentence': 'This video will briefly review the principles related to progress monitoring.', 'time': 0.022768341163715212, 'displayed_time': '[0:00:05]'}, {'id': 7, 'sentence': 'And finally we need data to determine if what we are doing in the classroom is working.', 'time': 0.25587278641127575, 'displayed_time': '[0:00:57]'}, {'id': 19, 'sentence': 'Common CBM progress monitoring measures include oral reading, fluency, phoneme identification, nays and written expression.', 'time': 0.759938561619082, 'displayed_time': '[0:02:48]'}, {'id': 23, 'sentence': 'In summary progress monitoring is a process to gather useful data that can be used with confidence to impact construction that will lead to student growth.', 'time': 0.9368901337188289, 'displayed_time': '[0:03:27]'}]
# qz = Quiz_generation(None, full)
# result = qz.generate("QA_pair_gen", quiz_set='large')
# print(result)
# # print(full)
