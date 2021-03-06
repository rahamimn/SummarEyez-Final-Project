#get gaze locations and generate new word/sentece grade table.
import pandas as pd 
import numpy as np
from runAutomaticAlgo import normalWeight
import sys
from io import StringIO

def find_index_of_nearest_xy(y_array, x_array, y_point, x_point):
    distance = (y_array - y_point) ** 2 + (x_array - x_point) ** 2
    idx = np.where(distance == distance.min())
    return int(idx[0])


def normalize_weights(word_table, sent_table):
    normalize_table(sent_table, True)
    normalize_table(word_table, False)
    return word_table, sent_table



#to_devide_len define if(like in sent_table) we should devide by number of charecter or not
def normalize_table(table, to_devide_len):
    table['normalized_weight'] = table['weight'].astype(float)
    max_sent_value1 = table['normalized_weight'].max()
    min_not_zero = max_sent_value1 
    for num in table['normalized_weight']:
        if num < min_not_zero and num != 0:
            min_not_zero= num

     # minus 20%       
    min_not_zero= 0.8 * min_not_zero
    for i in range(len(table['normalized_weight'])):
        if table['normalized_weight'][i] == 0:
            table['normalized_weight'][i] = min_not_zero

    if to_devide_len is True:
        for i in range(len(table['normalized_weight'])):
            table['normalized_weight'][i] = (min_not_zero / table['char_count'][i])

    normalWeight(table)


def calculate_weight(fixations, word_table, sentences_table):
    x_array = np.array(word_table['center_x'])
    y_array = np.array(word_table['center_y'])
    
    word_table['weight'] = 0
    sentences_table['weight'] = 0
    for row in fixations.iterrows():
        x_point = np.array([row[1]['Fixation Position X [px]']]) #real name    
        y_point = np.array([row[1]['Fixation Position Y [px]']]) #real name    
        idx = find_index_of_nearest_xy(y_array, x_array, y_point, x_point)     
        word_table.at[idx,'weight'] += int(row[1]['Event Duration [ms]']) #real name  
        sent_num =  word_table.loc[idx, 'sent_num']
        if(sent_num > -1):
            sentences_table.at[sent_num,'weight']  +=  int(row[1]['Event Duration [ms]'])       
       
    word_table, sentences_table = normalize_weights(word_table, sentences_table)
    word_table = word_table[['text', 'sent_num', 'par_num', 'weight', 'normalized_weight']]
    return word_table, sentences_table

def main(fixations, word_ocr, base_sentences_table):
    return calculate_weight(fixations, word_ocr, base_sentences_table)


if __name__ == "__main__":
  
    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    fixations = sys.stdin.buffer.read(size).decode("ascii")

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    word_ocr = sys.stdin.buffer.read(size).decode("utf-16")

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    base_sentences_table = sys.stdin.buffer.read(size).decode("utf-16")
   
    fixations = pd.read_csv(StringIO(fixations))
    word_ocr = pd.read_table(StringIO(word_ocr))
    base_sentences_table = pd.read_table(StringIO(base_sentences_table))

    word_table, sentences_table = main(fixations, word_ocr, base_sentences_table)

    word_table_utf16 = word_table.to_csv(sep="\t", index=False).encode('utf-16')
    sys.stdout.buffer.write(len(word_table_utf16).to_bytes(4, byteorder="big", signed=False))
    sys.stdout.buffer.write(word_table_utf16)

    sentences_table_utf16 = sentences_table.to_csv(sep="\t", index=False).encode('utf-16')
    sys.stdout.buffer.write(len(sentences_table_utf16).to_bytes(4, byteorder="big", signed=False))
    sys.stdout.buffer.write(sentences_table_utf16)
 
    