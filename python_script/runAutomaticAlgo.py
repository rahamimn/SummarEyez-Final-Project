
import importlib.util
import sys
import pandas as pd
from sklearn import preprocessing

mm_scaler = preprocessing.MinMaxScaler()

def main(base_sent_table, text, paths_algs):
    sent_tables = []
    for index in range(len(paths_algs)):
        sent_table_copy = base_sent_table.copy()
        spec = importlib.util.spec_from_file_location("*", "../automatic-algorithms/"+paths_algs[index])
        alg = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(alg)
        sent_table = pd.DataFrame(alg.run(text))
        sent_table_copy['weight'] = sent_table['weight']
        #we should fix this
        sent_table_copy['normalized_weight'] = sent_table['weight']
        sent_tables.append(sent_table_copy)
    return sent_tables
    
# if __main__:   
#     # base_sent_table = sys.stdin.read()
      # text = sys.stdin.read()
#     main
# main(1,,['Alg1.py', 'Alg2.py'])