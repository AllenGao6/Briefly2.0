#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul 12 10:42:45 2021

@author: Stanford
"""

from MindMap.MindMap import get_text_file

filePath = '/Users/Stanford/Desktop/Nitty AI project/Briefly2.0/Briefly/user_upload_notes/MindMap/indented_Test.txt'
    
graph = get_text_file(filePath) # a graph object. The Graph class in defined in this file too.
    
import random



def popQuiz(graph):
    '''
    This function uses a predefined graph instance to create multiple choice quiz.
    input: 
        graph: a graph defined in MindMap.py
    
    output:
        questionList:
            a list of tuple
                each tuple contain three elements:
                    1. A question in string format
                    2. All the multiple choice options in one string format
                    3. Answers in string
        
    '''
    keys = graph.allVertices()
    
    random.seed(1)
    
    
    questionList = []
    
    #This function forms a question for each vertice beside the first one.
    for i in range(len(keys)):
        
        AnswerKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        
        if (i != 0): #第一个是大标题，没有同类，所以跳过
        
            vert = keys[i]
            parent = graph.inverseGraDic[vert][0] #This gets the parent
            sameLevel = graph.gDictionary[parent] #This gets the vertices in same level
            optonLen = len(sameLevel)             #This gets the length of multiple choice options used for randomly unsert answers.
            answerInd = random.randint(0, optonLen-1) #This random index for the answer to appear.
            
            #This part get rid of the questioning-vertice in options. If ask about A, then A should not be in multiple choice options.
            same = []
            for v in sameLevel:
                if (v != vert): same.append(v)
                
            #This part inserting the answer into the options ramdomly.
            Answer = parent
            same.insert(answerInd, Answer)
            
            #This part turn all the options into one string.
            options = 'Options: '
            for i in range(len(same[:])):
                same[i] = same[:][i][0][:-1]
                options += AnswerKeys[i] + '. ' + same[i] + ' '
            
            #Now, variable 'options' is ready to use.
            #-----------------------------------
            
            #These two line finalize the question and answer. Turn each of them into a string
            question = 'Which of the following does ' + str(vert[0][:-1]) + " belongs to?"
            Answer = 'Answer: ' + Answer[0][:-1]
            
            #Preparing the final list that contains (question, options, Answer) for each question
            questionList.append((question, options, Answer))
        
    return(questionList)
        
'''
#Usage example:

a = popQuiz(graph)

for i in range(len(a)):
    print("Question " + str(i))
    print(a[i][0])
    print(a[i][1])
    print(a[i][2])
    print("-----")
'''



