
import runAutomaticAlgo
import pandas as pd
import sklearn
import math

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


sent_tables = runAutomaticAlgo.main(base_sent_table, text,['TF_IDF.py','Word_Frequency_Ver_2.py','Word_Frequency.py'])

def equal(number1, number2):
    assert math.isclose(number1 , number2, rel_tol=1e-2)

equal(sent_tables[0]['weight'][0],0.04309 )
equal(sent_tables[0]['normalized_weight'][0],0.042339 )

equal(sent_tables[1]['weight'][0],5)
equal(sent_tables[1]['normalized_weight'][0],0.679095)

equal(sent_tables[2]['weight'][0],2.333)
equal(sent_tables[2]['normalized_weight'][0],0.0)

sent_tables2 = runAutomaticAlgo.main(base_sent_table, text,['shouldFail.py'])
assert sent_tables2[0] == None