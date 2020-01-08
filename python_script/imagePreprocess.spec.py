import imagePreprocess
from PIL import Image

text, word_ocr, base_sentences_table = imagePreprocess.main(Image.open("./inputForTests/minTest.jpg"))

assert text == """According to you, which one is more important between teacher’s ability to relate
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

assert base_sentences_table.at[0,'text'] == """According to you, which one is more important between teacher’s ability to relate well with the students and excellent knowledge of the subject being taught?"""
assert base_sentences_table.at[0,'par_num'] == 1

assert base_sentences_table.at[1,'text'] == """Having advanced knowledge about the subjects is one of the requirement to be a good teacher."""
assert base_sentences_table.at[1,'par_num'] == 2

assert base_sentences_table.at[2,'text'] == """If the teacher does not know or understand the material that he/she has to teach, then what will he/she teach to his/her students?"""
assert base_sentences_table.at[2,'par_num'] == 2

assert word_ocr.at[71,'text'] == 'explanations'
assert word_ocr.at[71,'sent_num'] == 3
assert word_ocr.at[71,'par_num'] == 2