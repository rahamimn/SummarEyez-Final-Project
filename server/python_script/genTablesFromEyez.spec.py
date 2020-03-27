#get gaze locations and generate new word/sentece grade table.
import pandas as pd 
import genTablesFromEyez

fixations = pd.read_csv('./inputForTests/fixations.csv')
word_ocr = pd.read_csv('./inputForTests/word_ocr.tsv', sep = '\t')
base_sent_tables = pd.read_csv('./inputForTests/base_sent_table.tsv', sep = '\t')

word_table , sent_table = genTablesFromEyez.main(fixations, word_ocr, base_sent_tables)
# word_table.to_csv('./output/word_table.tsv', index=True, sep="\t", na_rep='', 
#     header=True, index_label=None, mode='w', decimal='.')
# sent_table.to_csv('./output/sent_table.tsv', index=True, sep="\t", na_rep='', 
#     header=True, index_label=None, mode='w', decimal='.')


assert word_table.at[63,'weight'] == 1100
assert word_table.at[128,'weight'] == 2200
assert word_table.at[63,'normalized_weight'] == 0.6571428571428571
assert word_table.at[128,'normalized_weight'] == 1.0

assert sent_table.at[2,'normalized_weight'] == 0.27389464549423603
assert sent_table.at[6,'normalized_weight'] == 0.0
assert sent_table.at[2,'weight'] == 1100
assert sent_table.at[6,'weight'] == 2200