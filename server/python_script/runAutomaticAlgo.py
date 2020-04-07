
import importlib.util
import sys
import pandas as pd
pd.options.mode.chained_assignment = None 
from sklearn import preprocessing
from io import StringIO
from sklearn.preprocessing import PowerTransformer
from sklearn.preprocessing import MinMaxScaler
import logging

mm_scaler = preprocessing.MinMaxScaler()

def main(base_sent_table, text, paths_algs):
    sent_tables = []
    for index in range(len(paths_algs)):
        sent_table_copy = base_sent_table.copy()
        spec = importlib.util.spec_from_file_location("*", "./automatic-algorithms/"+paths_algs[index])
        alg = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(alg)
        sent_table = pd.DataFrame(alg.run(text))
        sent_table_copy['weight'] = sent_table['weight']
        sent_table_copy['normalized_weight'] = sent_table['weight']
        normalized_sent_table = normalWeight(sent_table_copy)
        sent_tables.append(normalized_sent_table)
        
    return sent_tables


def normalWeight(sent_table): 
    logging.basicConfig(filename='etay2.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
    logging.warning('88')
    tmp_arr_for_normal_calc= []
    for j in range(len(sent_table)):
        tmp_arr_for_normal_calc.append([sent_table['normalized_weight'].get(j)])
    pt = PowerTransformer()
    logging.warning('44')
    transformed = pt.fit_transform(tmp_arr_for_normal_calc)
    minmax = MinMaxScaler()
    minmaxTransformed = minmax.fit_transform(transformed)
    logging.warning('00')
    logging.warning(len(sent_table))
    try:
        for p in range(len(sent_table)):
            try:
                logging.warning(p)
                sent_table['normalized_weight'][p] = minmaxTransformed[p][0] 
            except Exception as e:  
                logging.warning(p)
                logging.warning(sent_table['normalized_weight']) 
                logging.warning(minmaxTransformed[p])
                logging.warning(minmaxTransformed[p][0])
                logging.warning(e)
    except Exception as e:  
        logging.warning('11111')
    logging.warning('99')
    return sent_table

if __name__ == "__main__":

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    base_sent_table = sys.stdin.buffer.read(size).decode("utf-16")
    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    text = sys.stdin.buffer.read(size).decode("utf-16")

    base_sent_table = pd.read_table(StringIO(base_sent_table))
    sent_tables = main(base_sent_table,text, sys.argv[1:])

    for sent_table in sent_tables:
        sent_table_utf16 = sent_table.to_csv(sep="\t", index=False).encode('utf-16')
        sys.stdout.buffer.write(len(sent_table_utf16).to_bytes(4, byteorder="big",signed=False))
        sys.stdout.buffer.write(sent_table_utf16)

