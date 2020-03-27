
# import mergedTables
# import runAutomaticAlgo.py
import pandas as pd
import sklearn

from python_script import mergeTables

base_sent_table = pd.read_csv('../inputForTests/base_sent_table.tsv', sep = '\t')
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


#gets and prints the sentences and their weights.
#using run autumatic algo and the algs should be in the system
#NOTE: the 2 cases should give same value, they only test more then 1 lists
sent_table_calculator = mergeTables.main(base_sent_table, text,['Alg1.py','Alg2.py'], [0.1, 0.9])
print("sent_table_calculator: ")
for line in sent_table_calculator:
    print(line)


sent_table_calculator = mergeTables.main(base_sent_table, text,['Alg2.py', 'Alg1.py', 'Alg2.py'], [0.5, 0.1, 0.4])
print("sent_table_calculator: ")
for line in sent_table_calculator:
    print(line)
