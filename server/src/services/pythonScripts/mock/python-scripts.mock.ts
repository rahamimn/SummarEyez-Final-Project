import { PythonScriptInterface } from '../pythonScriptsTypes';

export class MockPythonScripts implements PythonScriptInterface{
    constructor(){
        //initialize
    }
    
    processImage(imageBuffer: Buffer){
      return Promise.resolve({})
    }

    runAutomaticAlgs(algs ,text, sent_tables){
        return Promise.resolve({})
      }
}
