
import importlib.util
import sys
import pandas as pd
pd.options.mode.chained_assignment = None 
from sklearn import preprocessing
from io import StringIO
from sklearn.preprocessing import PowerTransformer
from sklearn.preprocessing import MinMaxScaler

mm_scaler = preprocessing.MinMaxScaler()

def main(base_sent_table, text, paths_algs):
    sent_tables = []
    for index in range(len(paths_algs)):
        try:
            sent_table_copy = base_sent_table.copy()
            spec = importlib.util.spec_from_file_location("*", "./automatic-algorithms/"+paths_algs[index])
            alg = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(alg)
            sent_table = pd.DataFrame(alg.run(text))
            sent_table_copy['weight'] = sent_table['weight']
            sent_table_copy['normalized_weight'] = sent_table['weight']
            normalized_sent_table = normalWeight(sent_table_copy)
            sent_tables.append(normalized_sent_table)
        except: 
            # pass
            sent_tables.append(None)
    return sent_tables


def normalWeight(sent_table): 
    tmp_arr_for_normal_calc= []
    for j in range(len(sent_table)):
        tmp_arr_for_normal_calc.append([sent_table['normalized_weight'].get(j)])

    pt = PowerTransformer()
    transformed = pt.fit_transform(tmp_arr_for_normal_calc)
    minmax = MinMaxScaler()
    minmaxTransformed = minmax.fit_transform(transformed)

    for p in range(len(sent_table)):
        sent_table['normalized_weight'][p] = minmaxTransformed[p][0] 
    
    return sent_table

if __name__ == "__main__":

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    base_sent_table = sys.stdin.buffer.read(size).decode("utf-16")
    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    text = sys.stdin.buffer.read(size).decode("utf-16")

    base_sent_table = pd.read_table(StringIO(base_sent_table))
    sent_tables = main(base_sent_table,text, sys.argv[1:])

    for sent_table in sent_tables:
        if sent_table is None:  
            noOk = "noOk".encode('utf-8');
            sys.stdout.buffer.write(len(noOk).to_bytes(4, byteorder="big",signed=False))
            sys.stdout.buffer.write(noOk)
        else:
            sent_table_utf16 = sent_table.to_csv(sep="\t", index=False).encode('utf-16')
            sys.stdout.buffer.write(len(sent_table_utf16).to_bytes(4, byteorder="big",signed=False))
            sys.stdout.buffer.write(sent_table_utf16)

