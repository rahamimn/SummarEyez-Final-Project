import { PythonScriptInterface } from '../pythonScriptsTypes';

export class MockPythonScripts implements PythonScriptInterface{
    private processImageResult;
    private runAutomaticAlgsResult;
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

    
    processImage(imageBuffer: Buffer){
      return Promise.resolve(this.processImageResult)
    }

    runAutomaticAlgs(algs ,text, sent_tables){
        return Promise.resolve(this.runAutomaticAlgsResult)
    }
    

}
