import importlib.util
import sys
import pandas as pd
from sklearn import preprocessing
from io import StringIO

mm_scaler = preprocessing.MinMaxScaler()


#recieved the base sentence table: all the sentences
#sent table rate for all summaries
#for each summary, his summary_percent are in the third input of the function
def main(base_sent_table, sent_tables, summary_percent):
    tmp_sentence_weight = 0
    number_of_sentence = 0
    normalize_weight = []
    while number_of_sentence < (len(base_sent_table)):
        summary_index = 0
        for sent_table in sent_tables:
            tmp_sentence_weight = sentence_calculated_weight(summary_percent, number_of_sentence, summary_index,
                                                             sent_table, tmp_sentence_weight)
            summary_index+=1
        # base_sent_table['weight'][number_of_sentence] = tmp_sentence_weight
        # base_sent_table['normalize_weight'][number_of_sentence] = tmp_sentence_weight
        number_of_sentence+=1
        normalize_weight.append(tmp_sentence_weight)
        tmp_sentence_weight = 0

    base_sent_table.insert(5, 'weight', normalize_weight, True)
    base_sent_table.insert(6, 'normalized_weight', normalize_weight, True)

    #returns the updated Dataframe with the new 2 columns: weight and normalize_weight
    return base_sent_table



def sentence_calculated_weight(summary_weight, number_of_sentence, summary_index, sent_table, tmp_sentence_weight):
    tmp_sentence_weight += sent_table.normalized_weight[number_of_sentence] * summary_weight[summary_index]
    return tmp_sentence_weight


if __name__ == "__main__":

    size = int.from_bytes(sys.stdin.buffer.read(4), byteorder='big', signed=False)
    base_sent_table = sys.stdin.buffer.read(size).decode("latin-1")
    base_sent_table = pd.read_table(StringIO(base_sent_table))


    sent_tables = []
    num_of_summaries_number = int(sys.argv[1])
    number_of_summaries_index = 0
    summary_percent_array = [float(x) for x in sys.argv[2:]]

    while number_of_summaries_index < num_of_summaries_number:
        size = int.from_bytes(sys.stdin.buffer.read(4), byteorder='big', signed=False)
        curr_sent_table = sys.stdin.buffer.read(size).decode("latin-1")
        curr_sent_table = pd.read_table(StringIO(curr_sent_table))
        sent_tables.append(curr_sent_table)
        number_of_summaries_index += 1

    base_sent_tables_output = main(base_sent_table, sent_tables, summary_percent_array)
    base_sent_tables_output_utf8 = base_sent_tables_output.to_csv(sep="\t", index=False).encode('utf-8')
    sys.stdout.buffer.write(len(base_sent_tables_output_utf8).to_bytes(4, byteorder="big", signed=False))
    sys.stdout.buffer.write(base_sent_tables_output_utf8)