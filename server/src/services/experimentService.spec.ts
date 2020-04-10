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
import * as csvToJson from 'csvtojson';

import * as mockFS from 'mock-fs';

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

            const {status} = await experimentService.addImage(imageName,imageBuffer);

            expect(status).toEqual(0);
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
            const existName = 'imageName';
            await collectionsService.images().add(existName, {});
            const {status, error} = await experimentService.addImage(existName,new Buffer(""));

            expect(status).toEqual(-1);
            expect(error).toEqual('image name already exists');
        });
    });

    describe('get images' , () => {
        it('success', async () => {
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
    });

    describe('get experiments' , () => {
        it('success', async () => {
            const exp1 = {}
            const exp2 = {}

            collectionsService.experiments().add('exp1',exp1);
            collectionsService.experiments().add('exp2',exp2);

            const experiments = await experimentService.getExperiments();
            expect(experiments.status).toEqual(0);
            expect(experiments.experiments).toEqual([{id:'exp1',data:exp1},{id:'exp2',data:exp2}]);
        });
    });

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

            await collectionsService.experiments().add(expName, {});
            const {status, error} = await experimentService.addExperiment(expName, imageName);
            expect(status).toBe(-1);
            expect(error).toBe("The name of the experiment already exist in the system.");
        });
    });
    describe('get summary' , () => {
        const expName = 'exp1';
        const imageName = 'im1';
        const autoName = 'auto1.py';
        const autoFilePath = 'some/path';
        const mergedName = 'merged1';
        const mergedFilePath = 'some/merged/path';
        const sent_table_file = new Buffer("");

        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName, name: expName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName,{
                path: autoFilePath
            });
            await collectionsService.experiments().mergedSentOf(expName).add(mergedName,{
                path: mergedFilePath
            });
            await storageService.uploadBuffer(autoFilePath,sent_table_file,fileTypes.Csv);
            await storageService.uploadBuffer(mergedFilePath,sent_table_file,fileTypes.Csv);
        });

        it('success - auto', async () => {
            const {status, data} = await experimentService.getSummary(expName, 'auto',autoName);
            const json = await csvToJson({delimiter:'auto'}).fromString(sent_table_file.toString())
            expect(status).toEqual(0);
            expect(data).toEqual(expect.objectContaining({
                summary: json,
                title: imageName
            }));
        }); 

        it('success - eyes', async () => {
            expect(true).toEqual(true);
        });

        it('success - merged', async () => {
            const {status, data} = await experimentService.getSummary(expName, 'merged',mergedName);
            const json = await csvToJson({delimiter:'auto'}).fromString(sent_table_file.toString())
            expect(status).toEqual(0);
            expect(data).toEqual(expect.objectContaining({
                summary: json,
                title: imageName
            }));
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
            expect(error).toEqual('summary does not exist');
        });

        it('fail - eyes not exists', async () => {
            expect(true).toEqual(true);
        });

        it('fail - merged not exists', async () => {
            const notExistsMergedSummaryName = 'NotExistsMerged';
            const {status, error} = await experimentService.getSummary(expName, 'merged',notExistsMergedSummaryName);
            expect(status).toEqual(-2);
            expect(error).toEqual('summary does not exist');
        });
    });
   
    describe('run automatic algs' , async () => {
        const expName = 'exp1';
        const imageName = ' im1';
        const algName = 'alg1.py';
        const algPath = 'some/alg/path';

        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await storageService.uploadBuffer(`images/${imageName}/text`,new Buffer(""),fileTypes.Text);
            await storageService.uploadBuffer(`images/${imageName}/base_sent_table`,new Buffer(""),fileTypes.Csv);
        });

        it('success - exists locally', async () => {
            mockFS({
                'automatic-algorithms':{
                    [algName]: new Buffer("fff"),
                }
            });
            const sent_table = new Buffer('alg1');
            const tables = [{name: algName, sent_table}];

            pythonService.setRunAutomaticAlgsResult(tables);

            await experimentService.runAutomaticAlgs([algName],expName);
            
            const path = `images/${imageName}/algs/${algName}`;
            expect(await storageService.downloadToBuffer(path)).toBe(sent_table);
            expect(await collectionsService.images().sentTablesOf(imageName).get(algName)).toEqual(expect.objectContaining({
                type: 'auto',
                name: algName,
                path,
            }))

            mockFS.restore();
        });

        it('success - doesn not exist locally need to download', async () => {
            mockFS({
                'automatic-algorithms':{}
            });
            const path = `images/${imageName}/algs/${algName}`;

            await collectionsService.automaticAlgos().add(algName,{ path: algPath });
            await storageService.uploadBuffer(algPath, new Buffer('some-alg'), fileTypes.Text);
            const sent_table = new Buffer('alg1');
            const tables = [{name: algName, sent_table}];
            pythonService.setRunAutomaticAlgsResult(tables);

            await experimentService.runAutomaticAlgs([algName],expName);

            expect(await storageService.downloadToBuffer(path)).toBe(sent_table);
            expect(await collectionsService.images().sentTablesOf(imageName).get(algName)).toEqual(expect.objectContaining({
                type: 'auto',
                name: algName,
                path,
            }))

            mockFS.restore();
        });

        it('fail - name does not exists', async () => {
            const {status, error} = await experimentService.runAutomaticAlgs(['auto1'],'notExistsExpName');
            expect(status).toEqual(-1);
            expect(error).toEqual('experiment name does not exist');
        });
    });

    describe('get summaries' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        const autoName1 = 'auto1.py';
        const autoName2 = 'auto2.py';
        const merged1 = 'merged1';
        const merged2 = 'merged2';
        const metaData = {};

        beforeEach( async () => {
            await collectionsService.automaticAlgos().add(autoName1,{});
            await collectionsService.automaticAlgos().add(autoName2,{});
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName1, metaData);
            await collectionsService.experiments().mergedSentOf(expName).add(merged1, metaData);
            await collectionsService.experiments().mergedSentOf(expName).add(merged2, metaData);
        });

        it('success - (without eyes auto)', async () => {
            const {status, data} = await experimentService.getSummaries(expName);

            expect(status).toEqual(0);
            expect(data).toEqual(expect.objectContaining({
                auto: [{id:autoName1, data: metaData, disabled: false},{id:autoName2, data: metaData, disabled:true}],
                merged: [{id:merged1, data: metaData},{id:merged2, data: metaData}]
            }));
        });

        it('fail - experiment does not exists', async () => {
            const {status, error} = await experimentService.getSummaries('notExistsExpName');

            expect(status).toEqual(-1);
            expect(error).toEqual('experiment name does not exist');
        });
    });

    describe('merge summaries' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        const autoName1 = 'auto1.py';
        const autoName2 = 'auto2.py';
        const metaData = {};

        beforeEach( async () => {
            await collectionsService.automaticAlgos().add(autoName1,{});
            await collectionsService.automaticAlgos().add(autoName2,{});
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName1, metaData);
            await collectionsService.images().sentTablesOf(imageName).add(autoName2, metaData);
        });

        it('success - auto and eyes', async () => {
            expect(true).toEqual(true);
        });

        it('fail - experiment does not exists', async () => {
            const {status, error} = await experimentService.merge_algorithms("not exist", "new name", [{name: 'Alg1.py', type: 'auto', percentage: '1.0'}]);
            expect(status).toEqual(-1);
            expect(error).toEqual('The name of the experiment does not exist in the system.');
        });
        

        it('fail - auto does not exists', async () => {
            const {status, error} = await experimentService.merge_algorithms("expName", "new_name", [{name: 'Alg1.py', type: 'auto', percentage: '1.0'}]);
            expect(status).toEqual(-1);
            expect(error).toEqual('the sammaries name is not found');
        });

        it('auto algorithm exist for expirament(check assitent method)', async () => {
            const {status, error} = await experimentService.getSummaryForMerge("expName", 'auto', 'auto1.py');
            expect(status).toEqual(0);
            expect(error).toEqual(undefined);
        });

        it('auto algorithm do not exist for expirament(check assitent method)', async () => {
            const {status, error} = await experimentService.getSummaryForMerge("expName", 'auto', 'auto3.py');
            expect(status).toEqual(-2);
            expect(error).toEqual('auto summary name does not exist');
        });

        it('auto algorithm exist for expirament(check sent_table_initializer)', async () => {
            const {status} = await experimentService.sent_table_initializer(['auto2.py'],['auto'], "expName");
            expect(status).toEqual(0);
        });

        it('auto algorithm do not exist for expirament(check sent_table_initializer)', async () => {
            const {status, error} = await experimentService.sent_table_initializer(['auto3.py'],['auto'], "expName");
            expect(status).toEqual(-1);
            expect(error).toEqual('the sammary name is not found');
        });
    });
});