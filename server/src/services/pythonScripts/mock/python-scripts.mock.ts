import { PythonScriptInterface } from '../pythonScriptsTypes';

export class MockPythonScripts implements PythonScriptInterface{
  
    private processImageResult;
    private runAutomaticAlgsResult;
    private mergeTablesResult;
    private genTableFromEyezResult;

    constructor(){
    }

    setProcessImageResult(props : {text?: Buffer, word_ocr?:Buffer, base_sent_table?: Buffer} ){
        const result = {
            text: props.text || new Buffer('some-text'),
            word_ocr: props.word_ocr || new Buffer('word-ocr-file'),
            base_sent_table: props.base_sent_table || new Buffer('base-sent-table-file'),
        }
        this.processImageResult = result;
    }

    setRunAutomaticAlgsResult(tables?: {name:String, sent_table:Buffer}[]){
        this.runAutomaticAlgsResult = { tables: tables || [] };
    }

    setGenTableFromEyezResult (tables : {word_table:Buffer, sentences_table: Buffer} ){
        const result = {
            word_table: tables.word_table || new Buffer('word-table-file'),
            sentences_table: tables.sentences_table || new Buffer('sentences-table-file'),
        }
        this.genTableFromEyezResult = result;
    }

    setMergeTablesResult( merged_sent_table :Buffer){
        this.mergeTablesResult = { sent_table_of_merged: merged_sent_table };
    }
    
    processImage(imageBuffer: Buffer){
      return Promise.resolve(this.processImageResult)
    }

    runAutomaticAlgs(algs ,text, sent_tables){
        return Promise.resolve(this.runAutomaticAlgsResult)
    }

    mergeTables(algsPercent, sent_tables, base_sent_table){
        return Promise.resolve(this.mergeTablesResult)
    }
    
    genTableFromEyez (fixations: any, word_ocr: any, base_sentences_table: any){
        return Promise.resolve(this.genTableFromEyezResult)
    }
    

}
