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
                pythonOptions: ['-u'],
            };

            //@ts-ignorets
            let pyshell = new PythonShell('./python_script/imagePreprocess.py', options);
            
            this.sendBuffer(imageBuffer,pyshell)

            pyshell.stdout.on('data', function (buffer) {
                // console.log(buffer.toString());
                inputFiles.push(buffer)
            });

            pyshell.stderr.on('data', function (buffer) {
                console.log(buffer);
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
                pythonOptions: ['-u'],
                args: algsNames
              };

            //@ts-ignore
            let pyshell = new PythonShell('./python_script/runAutomaticAlgo.py', options);

            this.sendBuffer(base_sent_table, pyshell)
            this.sendBuffer(text, pyshell)

            pyshell.stdout.on('data', function (buffer) {
                // console.log(buffer.toString());
                inputFiles.push(buffer)
            });

            pyshell.stderr.on('data', function (buffer) {
                console.log(buffer);
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

    sendBuffer = (buffer, pyshell ) => {
        let buffMessageSize = Buffer.allocUnsafe(4);
        buffMessageSize.writeUInt32BE(buffer.length,0) 
        pyshell.send(buffMessageSize)
        pyshell.send(buffer);
    }

}