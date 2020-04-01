from time import sleep

import runAutomaticAlgo
import pandas as pd
import sklearn

from python_script import mergeTables

base_sent_table = pd.read_csv('./inputForTests/base_sent_table.tsv', sep = '\t')


#saves copy for the calculation, with sanity base sent table
base_sent_table1 = base_sent_table.copy()
base_sent_table2 = base_sent_table.copy()
base_sent_table3 = base_sent_table.copy()
base_sent_table4 = base_sent_table.copy()
base_sent_table5 = base_sent_table.copy()

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

#test1
#with alg1,2 and merged of them.
sent_tables1_2 = runAutomaticAlgo.main(base_sent_table3, text,['Alg1.py','Alg2.py'])
base_sent_table_merged1 = mergeTables.main(base_sent_table4, sent_tables1_2, [0.1, 0.9])
sent_tables1_2.append(base_sent_table_merged1)
base_sent_table_merged2 = mergeTables.main(base_sent_table5, sent_tables1_2, [0.5, 0.4, 0.1])
print("base sent test 1 output: ")
print(base_sent_table_merged2)


#test2 - with three algs
base_sent_table6 = base_sent_table.copy()
sent_tables1 = runAutomaticAlgo.main(base_sent_table1, text,['Alg1.py', 'Alg1.py', 'Alg2.py'])
base_sent_table_merged2 = mergeTables.main(base_sent_table6, sent_tables1, [0.5, 0.1, 0.4])
print("test 2 output: ")
print(base_sent_table_merged2)

#test3 - with only one alg
base_sent_table7 = base_sent_table.copy()
sent_tables2 = runAutomaticAlgo.main(base_sent_table2, text,['Alg2.py'])
the_third = mergeTables.main(base_sent_table7, sent_tables2, [1.0])
print("the next 2 prints should be the same")
print(the_third)
print(sent_tables2)
