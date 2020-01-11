#get gaze locations and generate new word/sentece grade table.
import pandas as pd 
import numpy as np

def find_index_of_nearest_xy(y_array, x_array, y_point, x_point):
    distance = (y_array - y_point) ** 2 + (x_array - x_point) ** 2
    idx = np.where(distance == distance.min())
    return int(idx[0])

def normalize_weights(word_table, sent_table):
    max_sent_value = sent_table['weight'].max()
    min_sent_value = sent_table['weight'].min()

    max_word_value = word_table['weight'].max()
    min_word_value = word_table['weight'].min()

    #normal
    word_table = word_table.copy()
    sent_table['weight'] = (sent_table['weight'] - min_sent_value) / (max_sent_value - min_sent_value)
    word_table['weight'] = (word_table['weight'] - min_word_value) / (max_word_value - min_word_value)

    return word_table, sent_table

def calculate_weight(fixations, word_table, sentences_table):
    x_array = np.array(word_table['center_x'])
    y_array = np.array(word_table['center_y'])

    word_table['weight'] = 0
    sentences_table['weight'] = 0

    for index,row in fixations.iterrows():
        x_point = np.array([row['Fixation Position X [px]']]) #real name
        y_point = np.array([row['Fixation Position Y [px]']]) #real name
        idx = find_index_of_nearest_xy(y_array, x_array, y_point, x_point) 
        word_table.at[idx,'weight'] += int(row['Event Duration [ms]']) #real name
        sent_num =  word_table.loc[idx, 'sent_num']
        if(sent_num > -1):
            sentences_table.at[sent_num,'weight']  +=  int(row['Event Duration [ms]'])

    word_table, sentences_table = normalize_weights(word_table, sentences_table)
    
    word_table = word_table[['text', 'sent_num', 'par_num', 'weight']]
    return word_table, sentences_table

def main(fixations, word_ocr, base_sentences_table):
    return calculate_weight(fixations, word_ocr, base_sentences_table)


