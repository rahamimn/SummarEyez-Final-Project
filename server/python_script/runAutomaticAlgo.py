
import importlib.util
import sys
import pandas as pd
from sklearn import preprocessing
from io import StringIO

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
        #we should fix this
        sent_table_copy['normalized_weight'] = sent_table['weight']
        sent_tables.append(sent_table_copy)
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

