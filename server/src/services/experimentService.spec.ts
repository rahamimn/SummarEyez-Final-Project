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
import { fileTypes } from './storage/storageTypes';

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

    describe('add automatic algorithm' , () => {
        it('success', async () => {
            const buffr = new Buffer('alg1')
            const new_alg_name = 'alg1_new.py';
            const {status, error} = await experimentService.addAutomaticAlgorithms(new_alg_name, buffr)
            expect(await storageService.downloadToBuffer(`automatic-algos/${new_alg_name}`)).toEqual(buffr);
            expect(await collectionsService.automaticAlgos().get(new_alg_name)).toEqual(expect.objectContaining({
                name: new_alg_name,
                path: `automatic-algos/${new_alg_name}`
            }))
            expect(status).toBe(0)
        });

        it('success - name without py extension', async () => {
            const buffr = new Buffer('alg1')
            const new_alg_name = 'alg1_new';
            const formatted_name = `${new_alg_name}.py`
            const {status, error} = await experimentService.addAutomaticAlgorithms(new_alg_name, buffr)
            expect(await storageService.downloadToBuffer(`automatic-algos/${formatted_name}`)).toEqual(buffr);
            expect(await collectionsService.automaticAlgos().get(formatted_name)).toEqual(expect.objectContaining({
                name: formatted_name,
                path: `automatic-algos/${formatted_name}`
            }))
            expect(status).toBe(0)
        });
    
        it('fail name - exists', async () => {
            const buffr = new Buffer('alg1')
            const new_alg_name = 'alg1_new.py';
            await experimentService.addAutomaticAlgorithms(new_alg_name, buffr)
            expect(await storageService.downloadToBuffer(`automatic-algos/${new_alg_name}`)).toEqual(buffr);
            expect(await collectionsService.automaticAlgos().get(new_alg_name)).toEqual(expect.objectContaining({
                name: new_alg_name,
                path: `automatic-algos/${new_alg_name}`
            }))
            const {status, error} = await experimentService.addAutomaticAlgorithms(new_alg_name, buffr)
            expect(status).toBe(-1)
            expect(error).toBe("the name of the file is not unique")
        });
    })
    
    describe('add image' , () => {
        it('success - no automatic algo in system ', async () => {
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
                type: 'auto',
                name: tables[0].name,
                path:`images/${imageName}/algs/${tables[0].name}`
            }));

            expect(await collectionsService.images().sentTablesOf(imageName).get(tables[1].name)).toEqual(expect.objectContaining({
                type: 'auto',
                name: tables[1].name,
                path:`images/${imageName}/algs/${tables[1].name}`
            }));
        });

        it('add image - success with auto algs in system ', async () => {
            expect(true).toEqual(true);
        });


        it('add image - fail name exists ', async () => {
            expect(true).toEqual(true);
        });
    });

    describe('get images' , () => {
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
            expect(images).toEqual([{id:'img1',data:img1},{id:'img2',data:img2}]);
        });
    })
    describe('add experiment' , () => {
        it('success', async () => {
            const expName= "exp_1";
            const imageName= "img_1";
            const res = await experimentService.addExperiment(expName, imageName);
            expect(res).toEqual({"status": 0});
            
            expect(await collectionsService.experiments().get(expName)).toEqual(expect.objectContaining({
                    name: expName,
                    imageName
            }));
        });

        it('fail name exists', async () => {
            const expName= "exp_1";
            const imageName= "img_1";

            const res = await collectionsService.experiments().add(expName, {});
            const {status, error} = await experimentService.addExperiment(expName, imageName);
            expect(status).toBe(-1);
            expect(error).toBe("The name of the experiment already exist in the system.");
        });
    });
    describe('get summary' , () => {
        const expName = 'exp1';
        const imageName = ' im1';
        const autoName = 'auto1.py';
        const autoFilePath = 'some/path';

        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName,{
                path:autoFilePath
            });
            await storageService.uploadBuffer(autoFilePath,new Buffer(""),fileTypes.Csv);
        });

        it('success - auto', async () => {
            const {status, data} = await experimentService.getSummary(expName, 'auto',autoName);
            expect(status).toEqual(0);
        }); 

        it('success - eyes', async () => {
            expect(true).toEqual(true);
        });

        it('success - merged', async () => {
            expect(true).toEqual(true);
        });
        
        it('fail - experiment not exists', async () => {
            const notExistsExpName = 'NotExistsExp1';
            const {status, error} = await experimentService.getSummary(notExistsExpName, 'auto','');
            expect(status).toEqual(-1);
            expect(error).toEqual('experiment name does not exist');
        });

        it('fail - auto not exists', async () => {
            const notExistsAutoSummaryName = 'NotExistsAuto';
            const {status, error} = await experimentService.getSummary(expName, 'auto',notExistsAutoSummaryName);
            expect(status).toEqual(-2);
            expect(error).toEqual('summary name does not exist');
        });

        it('fail - eyes not exists', async () => {
            expect(true).toEqual(true);
        });

        it('fail - merged not exists', async () => {
            expect(true).toEqual(true);
        });
    });
   
    describe('run automatic algs' , () => {
        it('success', async () => {
            expect(true).toEqual(true);
        });

        it('fail - name does not exists', async () => {
            expect(true).toEqual(true);
        });
    });

    describe('get summaries' , () => {
        it('success', async () => {
            expect(true).toEqual(true);
        });

        it('fail - experiment does not exists', async () => {
            expect(true).toEqual(true);
        });
    });

    describe('merge summaries' , () => {
        it('success - auto and eyes', async () => {
            expect(true).toEqual(true);
        });

        it('fail - experiment does not exists', async () => {
            expect(true).toEqual(true);
        });

        it('fail - auto does not exists', async () => {
            expect(true).toEqual(true);
        });
    });
});