import {PythonShell} from 'python-shell';
import { PythonScriptInterface } from '../pythonScriptsTypes';
const fs = require('fs');
//doesn't tested at all

export class PythonScripts implements PythonScriptInterface {
    constructor(){

    }
    sendBuffer = (buffer, pyshell ) => {
        let buffMessageSize = Buffer.allocUnsafe(4);
        buffMessageSize.writeUInt32BE(buffer.length,0) 
        pyshell.send(buffMessageSize)
        pyshell.send(buffer);
    }

    private readFiles = (pyshell: PythonShell, handleFiles: (files: Buffer[]) => any) => {
        let inputFiles: Buffer[] = [];
        let remainingBytes = 0;

        return new Promise((resolve,reject) => {
            pyshell.stdout.on('data', function (buffer: Buffer) {
                
                let workingBuffer = buffer;
                while(workingBuffer.length > 0){

                    if(remainingBytes === 0){
                        let size = workingBuffer.readUIntBE(0, 4)
                        let data = workingBuffer.slice(4,4+size)
                        
                        remainingBytes = size - data.length;

                        inputFiles.push(data)
                        workingBuffer = workingBuffer.slice(4+size)
                    }

                    else{
                        let data = workingBuffer.slice(0,remainingBytes)
                        remainingBytes = remainingBytes - data.length;
                        inputFiles[inputFiles.length-1] = Buffer.concat([inputFiles[inputFiles.length-1],data])
    
                        workingBuffer = workingBuffer.slice(data.length)
                    }
                }
            });

            pyshell.end((err,code,signal) => {
                if(code === 0 ){
                    resolve(handleFiles(inputFiles))
                }
                else{
                    reject()
                }
            });
        });
    }
    processImage(imageBuffer: Buffer){
        let options = {
            mode: 'binary',
            pythonOptions: ['-u'],
            stderrParser: 'text'
        };

        // @ts-ignorets
        let pyshell = new PythonShell('./python_script/imagePreprocess.py', options);
        
        this.sendBuffer(imageBuffer,pyshell)
        return this.readFiles(
            pyshell,
            files => ({
                text: files[0],
                word_ocr: files[1],
                base_sent_table: files[2],
            })
        );
    }

    runAutomaticAlgs(algsNames: string[], text, base_sent_table){
        let options = {
            mode: 'binary',
            pythonOptions: ['-u'],
            args: algsNames,
            stderrParser: 'text'
            };

        //@ts-ignore
        let pyshell = new PythonShell('./python_script/runAutomaticAlgo.py', options);

        this.sendBuffer(base_sent_table, pyshell)
        this.sendBuffer(text, pyshell)

        return this.readFiles(
            pyshell,
            files => ({
                tables: algsNames.map((name,i) => ({name, sent_table: files[i]}))
            })
        );
    }



    mergeTables(SummariesPercent: string[], sent_tables:Buffer [], base_sent_table: Buffer){
        let options = {
            mode: 'binary',
            pythonOptions: ['-u'],
            args: [String(SummariesPercent.length), ...SummariesPercent],
            stderrParser: 'text'
            };
        

        //@ts-ignore
        let pyshell = new PythonShell('./python_script/mergeTables.py', options);
        
        this.sendBuffer(base_sent_table, pyshell)
        for(var i=0; i < sent_tables.length ; i++){
            this.sendBuffer(sent_tables[i], pyshell)
        }


        return this.readFiles(
            pyshell,
            files => ({
                merged_table: files[0],
            })
        );
        
    }

}



// private readFiles = (pyshell: PythonShell, handleFiles: (files: Buffer[]) => any) => {
//     let inputFiles: Buffer[] = [];
//     let remainingBytes = 0;
//     return new Promise((resolve,reject) => {
//         pyshell.stdout.on('data', function (buffer: Buffer) {
//             console.log(buffer.length);
            
//             let workingBuffer = buffer;
//             while(workingBuffer.length > 0){
//                 if(remainingBytes === 0){
//                     // console.log(remainingBytes);
//                     let size = workingBuffer.readUIntBE(0, 4)
//                     console.log(size)
//                     let data = workingBuffer.slice(4,4+size)
                    
//                     remainingBytes = size - data.length;

//                     console.log(remainingBytes, data.length)
//                     inputFiles.push(data)
//                     workingBuffer = workingBuffer.slice(4+size)
//                     console.log(workingBuffer.length)
//                 }
//                 else{
//                     console.log(remainingBytes)
//                     let data = workingBuffer.slice(0,remainingBytes)
//                     remainingBytes = remainingBytes - data.length;
//                     console.log(data)
//                     console.log(remainingBytes, data.length)
//                     inputFiles[inputFiles.length-1] = Buffer.concat([inputFiles[inputFiles.length-1],data])
                    
//                     console.log(inputFiles[inputFiles.length-1]);
//                     workingBuffer = workingBuffer.slice(data.length)
//                 }
//             }
//         });

//         pyshell.stderr.on('data', function (buffer) {
//             console.log(buffer);
//         });

//         pyshell.end((err,code,signal) => {
//             if(code === 0 ){
//                 resolve(handleFiles(inputFiles))
//             }
//             else{
//                 reject()
//             }
//         });
//     });
// }