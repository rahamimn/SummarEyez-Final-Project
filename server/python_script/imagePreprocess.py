# creates tesseract word table
# for each automate algorithm creates sentence grade table

import pandas as pd 
import numpy as np
import nltk
from nltk.tokenize import sent_tokenize
import pytesseract
import sys
import io
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

nltk.data.path.append("/root/nltk_data")

def extract_text_from_jpg(image):
    textFile = open('./output/text.txt', 'w')
    text = pytesseract.image_to_string(image)
    textFile.write(text)
    return text

def extract_tsv_from_jpg(image):
    tsvFile = open('./output/data.tsv', 'w')
    tsvData = pytesseract.image_to_data(image, output_type='data.frame')
    tsvFileData = pytesseract.image_to_data(image)
    tsvFile.write(tsvFileData)
    return tsvData

def extract_sentences(text):
    sentences = sent_tokenize(text)
    sentences = [sent.replace('\n',' ') for sent in sentences]
    return sentences


def create_sentences_table(word_ocr, sentences):
    table_index_loop = 0
    par_in_ocr = 0
    par_num = 0
    sentencesWeights = [{'text': sent, 'par_num': -1, 'word_count': 0, 'char_count': len(sent) } for sent in sentences]
    words_of_sent = [sent.split() for sent in sentences]
    for sent_num, words_sentence in enumerate(words_of_sent):
        #hack to find the right paragraph
        first_word = True 
        empty_words_counter = 0
        sentencesWeights[sent_num]['word_count'] += len(words_sentence)
        for word in words_sentence:
            found = False
            for i in range(table_index_loop,len(word_ocr)):
                if pd.isna(word_ocr.loc[i, 'text']):
                    empty_words_counter += 1
                    
                if word_ocr.loc[i, 'text'] == word:
                #   print('found',i,word, sent_num)
                #   print(par_in_ocr,word_ocr.loc[i, 'par_num'])
                    if first_word and (empty_words_counter > 1 or par_in_ocr != word_ocr.loc[i, 'par_num'] ):
                        par_in_ocr = word_ocr.loc[i, 'par_num']
                        par_num += 1
                    first_word = False
                    word_ocr.at[i,'sent_num'] = int(sent_num)
                    word_ocr.at[i,'par_num'] = par_num
                    table_index_loop = i + 1
                    if sentencesWeights[sent_num]['par_num'] == -1:
                        sentencesWeights[sent_num]['par_num'] = par_num
                    found = True
                    break
            if not found:
                print('notFound',word, sent_num)

    #remove empty text
    word_ocr = word_ocr[pd.isna(word_ocr.text) == False ]
    word_ocr = word_ocr.reset_index()

    return word_ocr[['par_num','text','center_x','center_y','sent_num']], pd.DataFrame(sentencesWeights)
    
def pre_process(word_ocr, sentences):
    #delete non important colomns
    #important {text,par_num}
    word_ocr['center_x'] = word_ocr['left'] + word_ocr['width'] / 2 
    word_ocr['center_y'] = word_ocr['top'] + word_ocr['height'] / 2
    word_ocr['sent_num'] = -1

    word_ocr = word_ocr[['par_num','text','center_x','center_y','sent_num']]

    #create sent table 
    word_ocr, base_sentences_table = create_sentences_table(word_ocr, sentences)
    
    base_sentences_table.to_csv('./output/base_sent_table.tsv', index=True, sep="\t", na_rep='',
        header=True, index_label=None, mode='w', decimal='.')
    word_ocr.to_csv('./output/word_ocr.tsv', index=True, sep="\t", na_rep='', 
        header=True, index_label=None, mode='w', decimal='.')
    return word_ocr, base_sentences_table


# image = sys.stdin.read()
def main(image):
    word_ocr = extract_tsv_from_jpg(image)
    text = extract_text_from_jpg(image)
    sentences = extract_sentences(text)

    word_ocr, base_sentences_table = pre_process(word_ocr, sentences)
    return text, word_ocr, base_sentences_table


if __name__ == "__main__":

    size = int.from_bytes( sys.stdin.buffer.read(4), byteorder='big', signed=False )
    imageBuffer = sys.stdin.buffer.read(size)

    image = Image.open(io.BytesIO(imageBuffer))

    
    text, word_ocr, base_sentences_table = main(image)

    word_ocr_string = word_ocr.to_string()
    base_sentences_table_string = base_sentences_table.to_string()
    
    # text = text.decode('latin-1').encode('utf-8')
    # print(text)
    # print(len(text))
    sys.stdout.buffer.write(len(text.encode('utf-8')).to_bytes(4, byteorder="big", signed=False))
    # sys.stderr.write(len(text))
    sys.stdout.write(text)
    # ssys.stderr.write(text)
    # print('11111'+str(len(word_ocr_string)))
    sys.stdout.buffer.write(len(word_ocr_string.encode('utf-8')).to_bytes(4, byteorder="big",signed=False))
    sys.stdout.write(word_ocr.to_string())
    # # print(base_sentences_table.to_string())
    sys.stdout.buffer.write(len(base_sentences_table_string.encode('utf-8')).to_bytes(4, byteorder="big",signed=False))
    sys.stdout.write(base_sentences_table.to_string())


# sys.stdout.flush()
# sys.stdout.write(open('./readByPy.txt', 'r').read())