#get gaze locations and generate new word/sentece grade table.
import pandas as pd 
import numpy as np
from runAutomaticAlgo import normalWeight
import sys
from io import StringIO
import logging

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
    logging.warning('k')
    table['normalized_weight'] = table['weight'].astype(float)
    logging.warning('t')
    max_sent_value1 = table['normalized_weight'].max()
    min_not_zero = max_sent_value1 
    logging.warning('b')
    for num in table['normalized_weight']:
        if num < min_not_zero and num != 0:
            min_not_zero= num

     # minus 20%       
    min_not_zero= 0.8 * min_not_zero
    logging.warning('g')
    for i in range(len(table['normalized_weight'])):
        if table['normalized_weight'][i] == 0:
            table['normalized_weight'][i] = min_not_zero
    logging.warning('l')
    if to_devide_len is True:
        for i in range(len(table['normalized_weight'])):
            table['normalized_weight'][i] = (min_not_zero / table['char_count'][i])
    logging.warning('r')
    normalWeight(table)
    logging.warning('y')


def calculate_weight(fixations, word_table, sentences_table):
    logging.warning('00')
    x_array = np.array(word_table['center_x'])
    y_array = np.array(word_table['center_y'])
    
    word_table['weight'] = 0
    sentences_table['weight'] = 0
    logging.warning('11')
    try:
        for row in fixations.iterrows():
            logging.warning([row[1]['Fixation Position X [px]']])
            x_point = np.array([row[1]['Fixation Position X [px]']]) #real name
            logging.warning('g')
            y_point = np.array([row[1]['Fixation Position Y [px]']]) #real name
            logging.warning('r')
            idx = find_index_of_nearest_xy(y_array, x_array, y_point, x_point) 
            logging.warning('b')
            word_table.at[idx,'weight'] += int(row[1]['Event Duration [ms]']) #real name
            logging.warning('l')
            sent_num =  word_table.loc[idx, 'sent_num']
            logging.warning('115')
            if(sent_num > -1):
                sentences_table.at[sent_num,'weight']  +=  int(row[1]['Event Duration [ms]'])
    except Exception as e:
       logging.warning(e)
           

    logging.warning('4')
    word_table, sentences_table = normalize_weights(word_table, sentences_table)
    logging.warning('5')
    word_table = word_table[['text', 'sent_num', 'par_num', 'weight', 'normalized_weight']]
    return word_table, sentences_table

def main(fixations, word_ocr, base_sentences_table):
    return calculate_weight(fixations, word_ocr, base_sentences_table)


if __name__ == "__main__":
    logging.basicConfig(filename='etay.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
    logging.warning('0')
    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    fixations = sys.stdin.buffer.read(size).decode("ascii")
    logging.warning('1')

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    word_ocr = sys.stdin.buffer.read(size).decode("utf-16")
    logging.warning('2')

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    base_sentences_table = sys.stdin.buffer.read(size).decode("utf-16")
    logging.warning('3')
    fixations = pd.read_csv(StringIO(fixations))

    word_ocr = pd.read_table(StringIO(word_ocr))
    
    logging.warning('3.7')
    base_sentences_table = pd.read_table(StringIO(base_sentences_table))

    logging.warning('4')
    word_table, sentences_table = main(fixations, word_ocr, base_sentences_table)

    logging.warning('5')
    sys.stdout.buffer.write(len(word_table).to_bytes(4, byteorder="big",signed=False))
    sys.stdout.buffer.write(word_table)
    logging.warning('6')
    sys.stdout.buffer.write(len(sentences_table).to_bytes(4, byteorder="big",signed=False))
    sys.stdout.buffer.write(sentences_table)
    logging.warning('7')

