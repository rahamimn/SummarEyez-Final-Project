
//@ts-ignore
import {promises as fsPromises} from 'fs';
import {GoogleStorage} from './googleStorage';
import { fileTypes } from '../storageTypes';

jest.setTimeout(30000);

describe('googleStorage Tests',() =>{
    let googleStorage;

    beforeEach(() => {
        googleStorage = new GoogleStorage();
    });

    it.skip('upload and download csv', async () => {
        const csvBuffer = await fsPromises.readFile('./someCsv.csv')
        await googleStorage.uploadBuffer('tests/csvTest.csv',csvBuffer);
        const buffer = await googleStorage.downloadToBuffer('tests/csvTest.csv');
        expect(buffer[0].equals(csvBuffer)).toBeTruthy();
    })


    it.skip('upload and download image', async () => {
        const csvBuffer = await fsPromises.readFile('./test1.jpg')
        await googleStorage.uploadBuffer('tests/imageTest.jpg',csvBuffer, fileTypes.Image);
        const buffer = await googleStorage.downloadToBuffer('tests/imageTest.jpg');
        expect(buffer[0].equals(csvBuffer)).toBeTruthy();
    })
});