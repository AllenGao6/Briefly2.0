#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 26 10:16:51 2021

@author: Stanford
"""


from pyvis.network import Network
#import matplotlib.pyplot as ply
import networkx as nx
import os

class Graph:
    def __init__(self, dictionary = None):
        #This part initializes the vertex.
        self.verticeLength = 0
        self.allVerticesList = []
        
        #This part initializes the dictionary
        if (dictionary != None):
            self.gDictionary = dictionary
            #Inverse the dictionary Graph
            
        else:
            self.gDictionary = {}
            self.inverseGraDic = {}
        
    def allVertices(self):
        #This part builds the vertex dicrionary
        for key in self.gDictionary:
            if (key not in self.allVerticesList):
                self.verticeLength += 1
                self.allVerticesList.append(key)
            for vertex in self.gDictionary[key]:
               if (vertex not in self.allVerticesList):
                self.verticeLength += 1
                self.allVerticesList.append(vertex)
        return (self.allVerticesList)
        
    #Input: (Vout Vin edgeLen)
    def addVertex(self, edge):
        #This part contruct the normal graph
        if edge[0] in self.gDictionary:
            self.gDictionary[edge[0]].append((edge[1]))
        else:
            self.gDictionary[edge[0]] = [(edge[1])]
        
        #This part contuct the inverse graph
        if edge[1] in self.inverseGraDic:
            self.inverseGraDic[edge[1]].append((edge[0]))
        else:
            self.inverseGraDic[edge[1]] = [(edge[0])]
        
    #Input: a vertex
    #Output: Return a dictionary. Keys are u (vertex connecting towards the input), and values are edge length between them. 
    def find_U_E(self, v):
        uDic = {}
        
        for key in self.gDictionary:
            for vertex in self.gDictionary[key]:
               if (vertex[0] == v):
                   u = key
                   edgeLen = vertex[1]
                   uDic[u] = edgeLen
        return uDic
    
    
    def inversGraph(self):
        p = {}
        for key, sublist in self.gDictionary.items():
            for tup in sublist:
                if (tup[0] not in p):
                    p[tup[0]] = [(key, tup[1])]
                else:
                    p[tup[0]].append((key, tup[1]))
        return dict(p)




def get_text_file(dirc):
    '''
    Input:
        dirc: a directry of a text file with the right indented format
    Outout:
        a graph class instance for a mind map
    '''
    with open(dirc, "r") as f:
        f = list(f)
        topic = f[0]
        g = Graph()
        last = (topic, 0)
        for i in range(1, len(f)): #Assuming there will always be a topic that has no index
            numIndex = 0
            line = f[i]
            
            '''This part gets the index number'''
            for index in line:
                if (index == "\t"):
                   numIndex += 1
                else: 
                    break
            '''Now numIndex is ready to use'''
            
            line = (line[numIndex:], numIndex)
            
            if (numIndex > last[1]):
                
                g.addVertex((last, line))
                last = line
                
            else:
                
                upperLevel = g.inverseGraDic[last][0]
                while (numIndex - upperLevel[1] != 1):
                    upperLevel = g.inverseGraDic[upperLevel][0]
 
                g.addVertex((upperLevel, line))
                last = line
                
    
    

    return g



def get_mind_map(graph_class):
    '''
    Input:
        a graph class instance for a mind map
    Output:
        a 
    '''
    
    nx_graph = nx.DiGraph()
    keys = graph_class.gDictionary.keys()
    
    
    
    
    '''This part builds the edges'''
    for key in keys:
        
        for node in graph_class.gDictionary[key]:
            nx_graph.add_edge(key[0], node[0])
    

    
        
    nt = Network()
    #nt = Network(notebook = True) #This is for jupyter note book
    # populates the nodes and edges data structures
    nt.from_nx(nx_graph)
    fileName = 'MindMap.html'
    nt.show(fileName)
    path_of_mindmap = os.path.join(os.getcwd(), fileName)
    print("mind map stored in ", path_of_mindmap)
    return path_of_mindmap

'''
Usage Example:
    
    filePath = "/Users/Stanford/Desktop/Nitty AI project/indented.txt"
    
    graph = get_text_file(filePath) # a graph object. The Graph class in defined in this file too.
    
    filePath = get_mind_map(graph) # a html file path that contains a graph.
    
'''






