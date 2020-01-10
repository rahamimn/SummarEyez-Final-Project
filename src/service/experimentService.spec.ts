import { ExperimentService } from "./experimentService";
import { Collections } from "./collections/collections";
import { Storages } from "./storage/storage";
import { PythonScripts } from "./pythonScripts/pythonScripts";


//@ts-ignore
import {promises as fs} from 'fs';
import { print } from "util";

jest.setTimeout(30000);

describe('ExperimentService Tests',() =>{
    let experimentService: ExperimentService;
    beforeEach(() => {
        //not realy test, we should mock those
        const collectionsService = new Collections.Firestore();
        const storageService = new Storages.GoogleStorage();
        const pythonService = new PythonScripts.PythonScripts();
        experimentService = new ExperimentService({collectionsService, storageService, pythonService});
    });


    it('add automatic algorithm', async () => {
        const buffer = await fs.readFile('./automatic-algorithms/Alg1.py');
        await experimentService.addAutomaticAlgorithms('alg1',buffer);
        expect(true).toBe(true);
        // const csvBuffer = await fsPromises.readFile('./someCsv.csv')
        // await googleStorage.uploadBuffer('tests/csvTest.csv',csvBuffer);
        // const buffer = await googleStorage.downloadToBuffer('tests/csvTest.csv');
    })


    // it.skip('upload and download image', async () => {
    //     const csvBuffer = await fsPromises.readFile('./test1.jpg')
    //     await googleStorage.uploadBuffer('tests/imageTest.jpg',csvBuffer, fileTypes.Image);
    //     const buffer = await googleStorage.downloadToBuffer('tests/imageTest.jpg');
    //     expect(buffer[0].equals(csvBuffer)).toBeTruthy();
    // })
});