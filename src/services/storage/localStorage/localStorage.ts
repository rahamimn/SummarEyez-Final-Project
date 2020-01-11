import { Storage, fileTypes } from "../storageTypes";

export default class LocalStorage implements Storage {
    constructor(){
       
    }

    async uploadBuffer(path, fileBuffer, type = fileTypes.Text){
      return Promise.resolve();
    }

    async downloadToBuffer(path){
        return Promise.resolve(new Buffer('buff'));
    }

    async downloadToPath(path,destPath){
        return Promise.resolve();
    }
}