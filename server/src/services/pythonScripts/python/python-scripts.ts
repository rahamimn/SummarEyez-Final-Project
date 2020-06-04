import {PythonShell} from 'python-shell';
import { PythonScriptInterface } from '../pythonScriptsTypes';
import { addToSystemFailierLogger } from '../../../controller/system_loggers';
const fs = require('fs');
//doesn't tested at all
export class PythonError extends Error {
    constructor(message = "", ...args) {
      super(message);
      this.message = message;
    }
  }
export class PythonScripts implements PythonScriptInterface {
    constructor(){

    }
    sendBuffer = (buffer, pyshell ) => {
        let buffMessageSize = Buffer.allocUnsafe(4);
        buffMessageSize.writeUInt32BE(buffer.length,0) 
        pyshell.send(buffMessageSize)
        pyshell.send(buffer);
    }

    private readFiles = async (pyshell: PythonShell): Promise<Buffer[]> => {
        let inputFiles: Buffer[] = [];
        let remainingBytes = 0;

        //@ts-ignore
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
                    resolve(inputFiles)
                }
                else{
                    reject()
                }
            });
        });
    }
    async processImage(imageBuffer: Buffer){
        try{
            let options = {
                mode: 'binary',
                pythonOptions: ['-u'],
                stderrParser: 'text'
            };
    
            // @ts-ignorets
            let pyshell = new PythonShell('./python_script/imagePreprocess.py', options);
            
            this.sendBuffer(imageBuffer,pyshell)
            const [text, word_ocr, base_sent_table] = await this.readFiles(pyshell);
            if(!text || !word_ocr || !base_sent_table)
                throw new Error('files empty')
            return {text, word_ocr, base_sent_table};
        }
        catch(e){
            addToSystemFailierLogger("python script.ts, processImage")
            throw new PythonError(e)
        }   
    }
    async genTableFromEyez(fixations, word_ocr, base_sentences_table){
        try{
            let options = {
                mode: 'binary',
                pythonOptions: ['-u'], 
                stderrParser: 'text'
                };

            //@ts-ignore
            let pyshell = new PythonShell('./python_script/genTablesFromEyez.py', options);
            this.sendBuffer(fixations, pyshell)
            this.sendBuffer(word_ocr, pyshell)
            this.sendBuffer(base_sentences_table, pyshell)
        
            const [word_table, sentences_table] = await this.readFiles(pyshell);
            if(!word_table || !sentences_table)
                throw new Error('files empty')

            return {word_table, sentences_table};
        }
        catch(e){
            addToSystemFailierLogger("python script.ts, genTableFromEyez")
            throw new PythonError(e.message)
        }   
    }


    async runAutomaticAlgs(algsNames: string[], text, base_sent_table){
        try{
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


            const files = await this.readFiles(pyshell);
            const tables = algsNames.map((name,i) => ({name, sent_table: files[i]}));
            const filteredTables = tables.filter(row => row.sent_table.toString()!=='noOk');

            return {tables: filteredTables};
        }
        catch(e){
            addToSystemFailierLogger("python script.ts, runAutomaticAlgs")
            throw new PythonError(e)
        }  
    }



    async mergeTables(SummariesPercent: string[], sent_tables:Buffer [], base_sent_table: Buffer){
        try{
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

            const [merged_table] = await this.readFiles(pyshell);
            if(!merged_table)
                throw new Error('files empty')

            return {merged_table};
        }
        catch(e){
            addToSystemFailierLogger("python script.ts, mergeTables")
            throw new PythonError(e)
        } 
        
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