
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
        sent_table_copy = base_sent_table.copy()
        spec = importlib.util.spec_from_file_location("*", "./server/automatic-algorithms/"+paths_algs[index])
        alg = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(alg)
        sent_table = pd.DataFrame(alg.run(text))
        sent_table_copy['weight'] = sent_table['weight']
        sent_table_copy['normalized_weight'] = sent_table['weight']
        sent_tables.append(sent_table_copy)
    
    return normalWeight(sent_tables)


def normalWeight(sent_tables): 
    for index in range(len(sent_tables)):
        tmp_arr_for_normal_calc= []
        for j in range(len(sent_tables[index])):
            tmp_arr_for_normal_calc.append([sent_tables[index]['normalized_weight'].get(j)])
        pt = PowerTransformer()
        transformed = pt.fit_transform(tmp_arr_for_normal_calc)
        minmax = MinMaxScaler()
        minmaxTransformed = minmax.fit_transform(transformed)
        for p in range(len(sent_tables[index])):
            sent_tables[index]['normalized_weight'][p] = minmaxTransformed[p][0] 
    return sent_tables


if __name__ == "__main__":

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    base_sent_table = sys.stdin.buffer.read(size).decode("latin-1")
    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    text = sys.stdin.buffer.read(size).decode("latin-1")

    base_sent_table = pd.read_table(StringIO(base_sent_table))
    sent_tables = main(base_sent_table,text, sys.argv[1:])

    for sent_table in sent_tables:
        sent_table_utf8 = sent_table.to_csv(sep="\t", index=False).encode('utf-8')
        sys.stdout.buffer.write(len(sent_table_utf8).to_bytes(4, byteorder="big",signed=False))
        sys.stdout.buffer.write(sent_table_utf8)

