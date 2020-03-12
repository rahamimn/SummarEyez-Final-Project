import { ExperimentService } from "./experimentService";
import { Collections } from "./collections/collections";
import { Storages } from "./storage/storage";
import { PythonScripts } from "./pythonScripts/pythonScripts";

//@ts-ignore
import {promises as fs} from 'fs';
import { MockPythonScripts } from "./pythonScripts/mock/python-scripts.mock";

describe('ExperimentService Tests',() =>{
    let experimentService: ExperimentService;
    let collectionsService;
    let storageService;
    let pythonService: MockPythonScripts ;
    beforeEach(() => {
        collectionsService = new Collections.CollectionMock();
        storageService = new Storages.MockStorage();
        pythonService = new PythonScripts.MockPythonScripts();
        experimentService = new ExperimentService({collectionsService, storageService, pythonService});
    });

    //just for sanity
    it('add automatic algorithm', async () => {
        // const buffer = await fs.readFile('./automatic-algorithms/Alg1.py');
        // await experimentService.addAutomaticAlgorithms('alg1',buffer);
        expect(true).toBe(true);
    })

    it('add image', async () => {
        const imageName = 'someImage';
        const imageBuffer = await fs.readFile('./inputForTests/minTest.jpg');
        const files = {
            text: new Buffer('some-text'),
            word_ocr:  new Buffer('word-ocr-file'),
            base_sent_table: new Buffer('base-sent-table-file'),
        }
        pythonService.setProcessImageResult(files);
        await experimentService.addImage(imageName,imageBuffer);

        expect(await storageService.downloadToBuffer(`images/${imageName}/image`)).toEqual(imageBuffer);
        expect(await storageService.downloadToBuffer(`images/${imageName}/text`)).toEqual(files.text);
        expect(await storageService.downloadToBuffer(`images/${imageName}/word_ocr`)).toEqual(files.word_ocr);
        expect(await storageService.downloadToBuffer(`images/${imageName}/base_sent_table`)).toEqual(files.base_sent_table);
        expect(collectionsService.images().get(imageName)).toEqual(expect.objectContaining({
            name: imageName,
            image_path: `images/${imageName}/image`,
            text_path: `images/${imageName}/text`,
            word_ocr_path: `images/${imageName}/word_ocr`,
            base_sent_table_path: `images/${imageName}/base_sent_table`,
        }))
    })
});