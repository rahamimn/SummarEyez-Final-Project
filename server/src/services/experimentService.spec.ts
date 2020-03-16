import { ExperimentService } from './experimentService';
import { Collections } from "./collections/collections";
import { Storages } from "./storage/storage";
import { PythonScripts } from "./pythonScripts/pythonScripts";

//@ts-ignore
import {promises as fs} from 'fs';
import { MockPythonScripts } from "./pythonScripts/mock/python-scripts.mock";
import MockStorage from "./storage/mock/storage.mock";
import { CollectionMock } from "./collections/mock/collections.mock";
import {createImage} from '../utils/DTOCreators';

describe('ExperimentService Tests',() =>{
    let experimentService: ExperimentService;
    let collectionsService: CollectionMock;
    let storageService: MockStorage;
    let pythonService: MockPythonScripts ;
    beforeEach(() => {
        collectionsService = new Collections.CollectionMock();
        storageService = new Storages.MockStorage();
        pythonService = new PythonScripts.MockPythonScripts();
        experimentService = new ExperimentService({collectionsService, storageService, pythonService});
    });

    it('add automatic algorithm', async () => {
        const buffr = new Buffer('alg1')
        const new_alg_name = 'alg1_new';
        const status = await experimentService.addAutomaticAlgorithms(new_alg_name, buffr)
        expect(await storageService.downloadToBuffer(`automatic-algos/${new_alg_name}`)).toEqual(buffr);
        expect(await collectionsService.automaticAlgos().get(new_alg_name)).toEqual(expect.objectContaining({
            name: new_alg_name,
            path: `automatic-algos/${new_alg_name}`
        }))
    });


    it('add image', async () => {
        const imageName = 'someImage';
        const tables = [{name:'alg1', sent_table:new Buffer('alg1')}, {name:'alg2', sent_table:new Buffer('alg2')}];
        const imageBuffer = await fs.readFile('./inputForTests/minTest.jpg');
        const files = {
            text: new Buffer('some-text'),
            word_ocr:  new Buffer('word-ocr-file'),
            base_sent_table: new Buffer('base-sent-table-file'),
        }
        pythonService.setProcessImageResult(files);
        pythonService.setRunAutomaticAlgsResult(tables);

        await experimentService.addImage(imageName,imageBuffer);

        expect(await storageService.downloadToBuffer(`images/${imageName}/image`)).toEqual(imageBuffer);
        expect(await storageService.downloadToBuffer(`images/${imageName}/text`)).toEqual(files.text);
        expect(await storageService.downloadToBuffer(`images/${imageName}/word_ocr`)).toEqual(files.word_ocr);
        expect(await storageService.downloadToBuffer(`images/${imageName}/base_sent_table`)).toEqual(files.base_sent_table);
        expect(await storageService.downloadToBuffer(`images/${imageName}/algs/${tables[0].name}`)).toEqual(tables[0].sent_table);
        expect(await storageService.downloadToBuffer(`images/${imageName}/algs/${tables[1].name}`)).toEqual(tables[1].sent_table);
        expect(await collectionsService.images().get(imageName)).toEqual(expect.objectContaining({
            name: imageName,
            image_path: `images/${imageName}/image`,
            text_path: `images/${imageName}/text`,
            word_ocr_path: `images/${imageName}/word_ocr`,
            base_sent_table_path: `images/${imageName}/base_sent_table`,
        }));
        
        expect(await collectionsService.images().sentTablesOf(imageName).get(tables[0].name)).toEqual(expect.objectContaining({
            type: 'automatic',
            name: tables[0].name,
            path:`images/${imageName}/algs/${tables[0].name}`
        }));

        expect(await collectionsService.images().sentTablesOf(imageName).get(tables[1].name)).toEqual(expect.objectContaining({
            type: 'automatic',
            name: tables[1].name,
            path:`images/${imageName}/algs/${tables[1].name}`
        }));
    });

    it('get images', async () => {
        const img1 = createImage({
            name: 'img1',
        });
        const img2 = createImage({
            name: 'img2',
        });

        collectionsService.images().add('img1',createImage(img1));
        collectionsService.images().add('img2',createImage(img2));

        const images = await experimentService.getImages();
        expect(images).toEqual({img1,img2});
    })
});