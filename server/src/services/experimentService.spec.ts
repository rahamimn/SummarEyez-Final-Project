import { ExperimentService } from "./experimentService";
import { Collections } from "./collections/collections";
import { Storages } from "./storage/storage";
import { PythonScripts } from "./pythonScripts/pythonScripts";


//@ts-ignore
import {promises as fs} from 'fs';

describe('ExperimentService Tests',() =>{
    let experimentService: ExperimentService;
    beforeEach(() => {
        //not realy test, we should mock those
        const collectionsService = new Collections.CollectionMock();
        const storageService = new Storages.MockStorage();
        const pythonService = new PythonScripts.MockPythonScripts();
        experimentService = new ExperimentService({collectionsService, storageService, pythonService});
    });

    //just for sanity
    it('add automatic algorithm', async () => {
        const buffer = await fs.readFile('./automatic-algorithms/Alg1.py');
        await experimentService.addAutomaticAlgorithms('alg1',buffer);
        expect(true).toBe(true);
    })

    it('add image', async () => {
        const imageBuffer = await fs.readFile('./inputForTests/minTest.jpg');
        await experimentService.addImage('someImage',imageBuffer);
        expect(true).toBe(true);
    })
});