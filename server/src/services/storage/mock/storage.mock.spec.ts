
//@ts-ignore
import {promises as fs} from 'fs';
import StorageMock from './storage.mock';
import {Storage, fileTypes} from '../storageTypes';

describe('storage mock',() =>{
    let storage: Storage;
    beforeEach(() => {
        storage = new StorageMock();
    });

    it('upload and download', async () => {
        const buffer = new Buffer('1233');
        const somePath = 'path/file';
        await storage.uploadBuffer(somePath, buffer, fileTypes.Text);
        expect(await storage.downloadToBuffer(somePath)).toBe(buffer);
    })

    it('upload and download to file', async () => {
        const str = '1233';
        const buffer = new Buffer(str);
        const somePath = 'path/file';
        await storage.uploadBuffer(somePath, buffer, fileTypes.Text);
        await storage.downloadToPath(somePath,'./file');
        expect(await fs.readFile('./file',"utf8")).toBe(str);
        await fs.unlink('./file');
    })
});