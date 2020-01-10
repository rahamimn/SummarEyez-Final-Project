import {PythonShell} from 'python-shell';
export class PythonScripts{
    constructor(){
        //initialize
    }
    
    processImage(imageBuffer: Buffer){
        const promise = new Promise((resolve,reject) => {
            let inputFiles = [];
            
            let pyshell = new PythonShell('my_script.py');
            pyshell.stdout.on('data', function (buffer) {
                inputFiles.push(buffer)
            });
            pyshell.end((err,code,signal) => {
                if(code === 0 ){
                    resolve({
                        text: inputFiles[0],
                        word_ocr: inputFiles[1],
                        sent_ocr: inputFiles[2],
                        sent_table_alg1: inputFiles[3],
                        sent_table_alg2: inputFiles[4],
                        sent_table_alg3: inputFiles[5],
                    })
                }
                else{
                    reject()
                }
            });
        });
        return promise;
    }
}