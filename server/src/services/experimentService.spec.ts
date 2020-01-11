import { ExperimentService } from "./experimentService";
import { Collections } from "./collections/collections";
import { Storages } from "./storage/storage";
import { PythonScripts } from "./pythonScripts/pythonScripts";


//@ts-ignore
import {promises as fs} from 'fs';

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

    //just for sanity
    it('add automatic algorithm', async () => {
        const buffer = await fs.readFile('./automatic-algorithms/Alg1.py');
        await experimentService.addAutomaticAlgorithms('alg1',buffer);
        expect(true).toBe(true);
    })
});