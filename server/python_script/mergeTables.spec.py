from time import sleep

import runAutomaticAlgo
import pandas as pd
import sklearn
 
import mergeTables

base_sent_table = pd.read_csv('./inputForTests/base_sent_table.tsv', sep = '\t')

text = """According to you, which one is more important between teacher’s ability to relate
well with the students and excellent knowledge of the subject being taught?
Having advanced knowledge about the subjects is one of the requirement to be a good
teacher. If the teacher does not know or understand the material that he/she has to teach, then
what will he/she teach to his/her students? The teacher can give wrong information or
explanations to the students and it can ruin the children’s knowledge. It can lead to the poor
education. The teacher may also unable to answer the students’ questions. That is why having
an excellent knowledge of the material being taught is a must for a teacher, Teacher has to
give more information to the students beside the information available in the text books.
He/she should make or help the students to understand the lesson. That is his/her main
responsibility."""


#with alg1,2
sent_tables = runAutomaticAlgo.main(base_sent_table.copy(), text,['TF_IDF.py','Word_Frequency.py'])

merged = mergeTables.main(base_sent_table.copy(), sent_tables, [0.1, 0.9])
assert merged['weight'][0] == sent_tables[0]['normalized_weight'][0]*0.1 + sent_tables[1]['normalized_weight'][0]*0.9
assert merged['normalized_weight'][0] == sent_tables[0]['normalized_weight'][0]*0.1 + sent_tables[1]['normalized_weight'][0]*0.9


merged = mergeTables.main(base_sent_table.copy(), [sent_tables[0]], [1.0])
assert merged['weight'][0] == sent_tables[0]['normalized_weight'][0]
assert merged['normalized_weight'][0] == sent_tables[0]['normalized_weight'][0]
