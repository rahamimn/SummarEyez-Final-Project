import { Storage, fileTypes } from "../storageTypes";
//@ts-ignore
import {promises as fs} from 'fs';

export default class MockStorage implements Storage {
    private files;
    constructor(){
       this.files = {};
    }

    async uploadBuffer(path, fileBuffer, type = fileTypes.Text){
      this.files[path] = fileBuffer;
    }

    async downloadToBuffer(path){
        return this.files[path];
    }

    async downloadToPath(path,destPath){
        return fs.writeFile(destPath,this.files[path])
    }
}