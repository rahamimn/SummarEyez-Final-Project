import nltk
#possible libs
#------------------
#import numpy as np
#import pandas as pd
#import sklearn

def tokenize(text):
    return nltk.sent_tokenize(text)

#must exist function
def run(text):
    sentence_list = tokenize(text)
 
    #calulate weights 
    sentencesWeights = [{'text': sentence, 'weight': 0} for sentence in sentence_list]

    #return object 
    return sentencesWeights

