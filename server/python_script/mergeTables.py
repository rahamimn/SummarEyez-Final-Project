import importlib.util
import sys
import pandas as pd
from sklearn import preprocessing
from io import StringIO
import runAutomaticAlgo

mm_scaler = preprocessing.MinMaxScaler()


#recieved the base sentence table: all the sentences
#sent table rate for all algs
#for each alg, his summary_percent are in the third input of the function
def main(base_sent_table, sent_tables, summary_percent):
    # sent_tables = runAutomaticAlgo.main(base_sent_table, text, paths_algs)
    sent_table_calculator = []
    tmp_sentence_weight = 0
    number_of_sentence=0
    while number_of_sentence < (len(base_sent_table)-1):
        algo_index = 0
        for lines in sent_tables:
            tmp_sentence_weight = sentence_calculated_weight(summary_percent, number_of_sentence, algo_index, lines, tmp_sentence_weight)
            algo_index+=1
        sent_table_calculator.append({"line_number": number_of_sentence, "weight_value": tmp_sentence_weight })
        tmp_sentence_weight = 0
        number_of_sentence+=1

    return sent_table_calculator



def sentence_calculated_weight(algs_weight, i, j, lines, tmp_sentence_weight):
    tmp_sentence_weight += lines.normalized_weight[i] * algs_weight[j]
    return tmp_sentence_weight


if __name__ == "__main__":
    print()

