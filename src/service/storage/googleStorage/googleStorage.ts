import { fileTypes, Storage } from "../storageTypes";

const admin = require('firebase-admin');
const serviceAccount = require('../../../../serviceAcountKey.json');

export class GoogleStorage implements Storage {
    bucket: any;
    constructor(){
        if(!admin.apps.length){
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: "text-summarization-262015.appspot.com"
            });
        }
        this.bucket = admin.storage().bucket();
    }

    async uploadBuffer(path, fileBuffer, type = fileTypes.Text){
        return new Promise((res,rej)=> {
            const file = this.bucket.file(path);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: type
                }
            });
            stream.on('error', (err) => {
                rej(err);
            });
            stream.on('finish', () => {
                res();
            });
            stream.end(new Buffer(fileBuffer, 'base64'))
        })
    }

    async downloadToBuffer(path){
        const res = await this.bucket.file(path).download({validation: false});
        return res[0];
    }

    async downloadToPath(path,destPath){
        return await this.bucket.file(path).download({destination: destPath, validation: false});
    }
}

export const sss = 111;