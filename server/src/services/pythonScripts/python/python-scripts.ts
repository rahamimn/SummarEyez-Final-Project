import {PythonShell} from 'python-shell';
import { PythonScriptInterface } from '../pythonScriptsTypes';
const fs = require('fs');
//doesn't tested at all

export class PythonScripts implements PythonScriptInterface {
    constructor(){

    }
    processImage(imageBuffer: Buffer){
        return new Promise((resolve,reject) => {
            let inputFiles: Buffer[] = [];

            let options = {
                mode: 'binary',
                pythonOptions: ['-u'],
            };

            let remainingBytes = 0;

            //@ts-ignorets
            let pyshell = new PythonShell('./python_script/imagePreprocess.py', options);
            
            this.sendBuffer(imageBuffer,pyshell)
            pyshell.stdout.on('data', function (buffer) {
                console.log(buffer.length);
                
                let workingBuffer = buffer;
                while(workingBuffer.length > 0){
                    if(remainingBytes === 0){
                        // console.log(remainingBytes);
                        let size = workingBuffer.readUIntBE(0, 4)
                        console.log(size)
                        let data = workingBuffer.slice(4,4+size)
                        
                        remainingBytes = size - data.length;

                        console.log(remainingBytes, data.length)
                        inputFiles.push(data)
                        workingBuffer = workingBuffer.slice(4+size)
                        console.log(workingBuffer.length)
                    }
                    else{
                        console.log(remainingBytes)
                        let data = workingBuffer.slice(0,remainingBytes)
                        remainingBytes = remainingBytes - data.length;
                        console.log(data)
                        console.log(remainingBytes, data.length)
                        inputFiles[inputFiles.length-1] = Buffer.concat([inputFiles[inputFiles.length-1],data])
                        
                        console.log(inputFiles[inputFiles.length-1]);
                        workingBuffer = workingBuffer.slice(data.length)
                    }
                }


                // if(type.toString() === '/start/'){
                //     console.log('new')
                //     inputFiles.push(buffer.slice(7))
                //     console.log('after', inputFiles.length )
                // }
                // else{
                //     console.log('concat before', inputFiles[inputFiles.length-1].length )

                //     inputFiles[inputFiles.length-1] = Buffer.concat([inputFiles[inputFiles.length-1],buffer])
                //     console.log('after', inputFiles[inputFiles.length-1].length )
                // }
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