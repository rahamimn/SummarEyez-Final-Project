import {PythonShell} from 'python-shell';
import { PythonScriptInterface } from '../pythonScriptsTypes';

//doesn't tested at all

export class PythonScripts implements PythonScriptInterface {
    constructor(){

    }
    processImage(imageBuffer: Buffer){
        return new Promise((resolve,reject) => {
            let inputFiles = [];

            let options = {
                mode: 'binary',
            };

            //@ts-ignorets
            let pyshell = new PythonShell('/python_script/imagePreprocess.py', options);
            pyshell.send(imageBuffer);

            pyshell.stdout.on('data', function (buffer) {
                inputFiles.push(buffer)
            });
            pyshell.end((err,code,signal) => {
                if(code === 0 ){
                    resolve({
                        text: inputFiles[0],
                        word_ocr: inputFiles[1],
                        base_sent_table: inputFiles[2],
                    })
                }
                else{
                    reject()
                }
            });
        });
    }

    runAutomaticAlgs(algsNames: string[], text, base_sent_table){
        return new Promise((resolve,reject) => {
            let inputFiles = [];

            let options = {
                mode: 'binary',
                args: algsNames
              };

            //@ts-ignore
            let pyshell = new PythonShell('./python_script/runAutomaticAlgo.py', options);

            pyshell.send(text);
            pyshell.send(base_sent_table);

            pyshell.stdout.on('data', function (buffer) {
                inputFiles.push(buffer)
            });
            pyshell.end((err,code,signal) => {
                if(code === 0 ){
                    resolve(algsNames.map((name,i) => ({
                        name,
                        sent_table: inputFiles[i]
                    })))
                }
                else{
                    reject()
                }
            });
        });
    }
}