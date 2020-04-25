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
import { ERROR_STATUS, ERRORS } from '../utils/Errors';

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
            expect(status).toBe(ERROR_STATUS.NAME_NOT_VALID)
            expect(error).toBe(ERRORS.AlG_EXISTS)
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

            expect(status).toEqual(ERROR_STATUS.NAME_NOT_VALID);
            expect(error).toEqual(ERRORS.IM_EXISTS);
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
            expect(experiments.data).toEqual([{id:'exp1',data:exp1},{id:'exp2',data:exp2}]);
        });
    });

    describe('add experiment' , () => {
        it('success', async () => {
            const expName= "exp_1";
            const imageName= "img_1";
            const res = await experimentService.addExperiment(expName, imageName);
            expect(res.status).toEqual(0);
            
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
            expect(status).toBe(ERROR_STATUS.NAME_NOT_VALID);
            expect(error).toBe(ERRORS.EXP_EXISTS);
        });
    });
    describe('get summary' , () => {
        const expName = 'exp1';
        const imageName = 'im1';
        const autoName = 'auto1.py';
        const autoFilePath = 'some/path';
        const mergedName = 'merged1';
        const eyesName = 'eyes1';
        const mergedFilePath = 'some/merged/path';
        const eyesSentFilePath = 'some/eyes/path';
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
            await collectionsService.experiments().getTests(expName).add(eyesName,{
                sent_table_path: eyesSentFilePath
            });

            await storageService.uploadBuffer(autoFilePath,sent_table_file,fileTypes.Csv);
            await storageService.uploadBuffer(mergedFilePath,sent_table_file,fileTypes.Csv);
            await storageService.uploadBuffer(eyesSentFilePath,sent_table_file,fileTypes.Csv);
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

        it('success - asText - auto', async () => {
            const {status, data} = await experimentService.getSummary(expName, 'auto',autoName, true);
            expect(status).toEqual(0);
            expect(data).toEqual(sent_table_file.toString());
        }); 

        it('success - eyes', async () => {
            const {status, data} = await experimentService.getSummary(expName, 'eyes',eyesName);
            const json = await csvToJson({delimiter:'auto'}).fromString(sent_table_file.toString())
            expect(status).toEqual(0);
            expect(data).toEqual(expect.objectContaining({
                summary: json,
                title: imageName
            }));
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
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });

        it('fail - auto not exists', async () => {
            const notExistsAutoSummaryName = 'NotExistsAuto';
            const {status, error} = await experimentService.getSummary(expName, 'auto',notExistsAutoSummaryName);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.SUMMARY_NOT_EXISTS);
        });

        it('fail - eyes not exists', async () => {
            const notExistsEyesSummaryName = 'NotExistsAuto';
            const {status, error} = await experimentService.getSummary(expName, 'eyes',notExistsEyesSummaryName);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.SUMMARY_NOT_EXISTS);
        });

        it('fail - merged not exists', async () => {
            const notExistsMergedSummaryName = 'NotExistsMerged';
            const {status, error} = await experimentService.getSummary(expName, 'merged',notExistsMergedSummaryName);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.SUMMARY_NOT_EXISTS);
        });
    });

    describe('run automatic algs', () => {
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
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });
    });

    describe('get summaries' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        const autoName1 = 'auto1.py';
        const autoName2 = 'auto2.py';
        const merged1 = 'merged1';
        const merged2 = 'merged2';
        const eyes1 = 'eyes1';
        const eyes2 = 'eyes2';
        const metaData = {};

        beforeEach( async () => {
            await collectionsService.automaticAlgos().add(autoName1,{});
            await collectionsService.automaticAlgos().add(autoName2,{});
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName1, metaData);
            await collectionsService.experiments().getTests(expName).add(eyes1,metaData)
            await collectionsService.experiments().getTests(expName).add(eyes2,metaData)
            await collectionsService.experiments().mergedSentOf(expName).add(merged1, metaData);
            await collectionsService.experiments().mergedSentOf(expName).add(merged2, metaData);
        });

        it('success', async () => {
            const {status, data} = await experimentService.getSummaries(expName);

            expect(status).toEqual(0);
            expect(data).toEqual(expect.objectContaining({
                auto: [{id:autoName1, data: metaData, disabled: false},{id:autoName2, data: metaData, disabled:true}],
                merged: [{id:merged1, data: metaData},{id:merged2, data: metaData}],
                eyes: [{id:eyes1, data: metaData},{id:eyes2, data: metaData}]
            }));
        });

        it('fail - experiment does not exists', async () => {
            const {status, error} = await experimentService.getSummaries('notExistsExpName');

            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });
    });

    describe('merge summaries' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        const autoName1 = 'auto1.py';
        const autoName2 = 'auto2.py';
        const algPath = 'some/alg/path';
        const newMergedName = "newMerged";
        const merged_sent_table = new Buffer('merged1');
        const path_of_merged = 'experiments/expName/merged-sent/newMerged';
        const storage_path = `experiments/${expName}/merged-sent/newMerged`

        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().sentTablesOf(imageName).add(autoName1, {path: algPath});
            await collectionsService.images().sentTablesOf(imageName).add(autoName2, {path: algPath});
            await storageService.uploadBuffer(algPath, new Buffer('some-alg'), fileTypes.Text);
        });


        it('add merged success', async () => {
            pythonService.setMergeTablesResult(merged_sent_table);
            const merged_response = await experimentService.mergeSummaries(expName, newMergedName, [{name: autoName1, type:'auto', percentage: '1.0'}]);
            expect(merged_response.status).toBe(0)
            const object_of_merged = await collectionsService.experiments().mergedSentOf(expName).get(newMergedName);
            expect(object_of_merged.path).toEqual(path_of_merged)
            expect(object_of_merged.name).toEqual(newMergedName)
            expect(object_of_merged.type).toEqual("merged")
            const merged_storage = await storageService.downloadToBuffer(storage_path); 
            expect(merged_storage).toBe(merged_sent_table)
        });

        it('add merged 2 different auto algorithms success', async () => {
            pythonService.setMergeTablesResult(merged_sent_table);
            const merged_response = await experimentService.mergeSummaries(expName, newMergedName, [{name: autoName1, type:'auto', percentage: '0.3'},{name: autoName2, type:'auto', percentage: '0.7'}]);
            expect(merged_response.status).toBe(0)
            const object_of_merged = await collectionsService.experiments().mergedSentOf(expName).get(newMergedName);
            expect(object_of_merged.path).toEqual(path_of_merged)
            expect(object_of_merged.name).toEqual(newMergedName)
            expect(object_of_merged.type).toEqual("merged")
            expect(object_of_merged.mergedInput).toEqual([{"name": "auto1.py", "percentage": "0.3", "type": "auto"}, {"name": "auto2.py", "percentage": "0.7", "type": "auto"}])
            const merged_storage = await storageService.downloadToBuffer(storage_path); 
            expect(merged_storage).toBe(merged_sent_table)
        });

        it('no input for merge summary provided', async () => {
            const {status, error} = await experimentService.mergeSummaries(expName, newMergedName, []);
            expect(status).toBe(ERROR_STATUS.GENERAL_ERROR)
            expect(error).toBe('no summaries input provided')
        });



        it('success - auto and eyes', async () => {
            expect(true).toEqual(true);
        });

        it('fail - experiment does not exists', async () => {
            const {status, error} = await experimentService.mergeSummaries("not exist", "new name", [{name: 'Alg1.py', type: 'auto', percentage: '1.0'}]);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });
        

        it('fail - auto does not exists', async () => {
            const {status, error} = await experimentService.mergeSummaries("expName", "new_name", [{name: 'Alg1.py', type: 'auto', percentage: '1.0'}]);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.SUMMARY_NOT_EXISTS);
        });
    });

    describe('get all questions' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
            await collectionsService.images().questionsOf(imageName).add("1234", {
                question: "hello",
                answers: ["11","22", "33", "44"],
                correctAnswer: "2",
                creation_date: "20/03/1993"
            }); 
        });
        it('fail- no expirament', async () => {   
            const {status, error} = await experimentService.getAllQuestions("fake_name")                       
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);     
        });

        it('success - get all questions with one question', async () => {   
            const addQuestion = await experimentService.getAllQuestions(expName);                    
            expect(addQuestion.status).toBe(0);
            expect(addQuestion.data.length).toBe(1);
        });

        it('success - get all questions with no questions', async () => {   
            const imageNameNoQuestions = "image";
            const expNoQuestions = "exp";
            await collectionsService.experiments().add(expNoQuestions, {imageNameNoQuestions});
            await collectionsService.images().add(imageNameNoQuestions, {});
            const addQuestionNoQuestions = await experimentService.getAllQuestions(expNoQuestions)                      
            expect(addQuestionNoQuestions.status).toBe(0)
            expect(addQuestionNoQuestions.data.length).toBe(0)        
        });
    });

    describe('add new questions' , () => {
        const expName = 'expName';
        const imageName = 'imageName';
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {});
        });

        it('success- question is added', async () => {  
            const addQuestionResponse = await experimentService.addQuestion(expName, "how are u doing?", [{answer: "ok"},{answer: "good enought"},{answer: "very good"},{answer: "not ok" }], 3)                      
            expect(addQuestionResponse.status).toBe(0)
        });

        it('fail- no experiment', async () => {   
            const {status, error} = await experimentService.addQuestion("fake_name", "how are u doing?", [{answer: "ok"},{answer: "good enought"},{answer: "very good"},{answer: "not ok" }], 3);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);                     
        });

        it('fail- wrong answer number (above 4 or 0 or less)', async () => { 
            const addQuestionBigNumber = await experimentService.addQuestion(expName, "how are u doing?", [{answer: "ok"},{answer: "good enought"},{answer: "very good"},{answer: "not ok" }], 5)                      
            expect(addQuestionBigNumber.status).toBe(-1);
            expect(addQuestionBigNumber.error).toBe("the value of the correct answer is not valid");

            const addQuestionNegativeNumber = await experimentService.addQuestion(expName, "how are u doing?", [{answer: "ok"},{answer: "good enought"},{answer: "very good"},{answer: "not ok" }], -2)                      
            expect(addQuestionNegativeNumber.status).toBe(-1);
            expect(addQuestionNegativeNumber.error).toBe("the value of the correct answer is not valid");
        });
    });

    describe('generate tables from eyez' , () => {
        const expName = 'exp1';
        const imageName = 'im1';
       
        const word_ocr_path = `images/${imageName}/word_ocr`;
        const base_sent_table_path = `images/${imageName}/base_sent_table`;
        
        const params={
            testId: 'testId',
            formId : '5',
            answers : '5',
            score : '5',
            sentanceWeights : '5',
            experimentName: expName,
            fixations: 'buffer' 
        };            
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {imageName});
            await collectionsService.images().add(imageName, {
                base_sent_table_path: base_sent_table_path,
                name: imageName,
                word_ocr_path: word_ocr_path

            });
            await storageService.uploadBuffer(base_sent_table_path,new Buffer("sent_table"),fileTypes.Csv);
            await storageService.uploadBuffer(word_ocr_path,new Buffer("word_table"),fileTypes.Csv);

            params.experimentName = expName;
        });

        it('success - run genTablesFromEyez with testId = testId', async () => {

            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const tables = {word_table: word_table, sentences_table: sent_table};

            pythonService.setGenTableFromEyezResult(tables);

            const {status} = await experimentService.addTest(params);
            expect(status).toEqual(0);

            const expUploadPaths = 
                {
                sent_table_path:`experiments/${params.experimentName}/tests/${params.testId}/testSentTables`,
                word_table_path:`experiments/${params.experimentName}/tests/${params.testId}/testWordTables`
                }

            expect(await storageService.downloadToBuffer(expUploadPaths.sent_table_path)).toBe(sent_table);
            expect(await storageService.downloadToBuffer(expUploadPaths.word_table_path)).toBe(word_table);
            expect(await collectionsService.experiments().getTests(params.experimentName).get(params.testId)).toEqual(expect.objectContaining({
                name: params.testId,
                formId: params.formId,
                answers : params.answers,
                score : params.score,
                sentanceWeights :params.sentanceWeights,
                sent_table_path: expUploadPaths.sent_table_path ,
                word_table_path: expUploadPaths.word_table_path,
                type: 'eyes'
            }))

        });

        it('fail - experimentName not exist', async () => {

            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const tables = {word_table: word_table, sentences_table: sent_table};
            params.experimentName =  'notExist';

            pythonService.setGenTableFromEyezResult(tables);

            const {status, error} = await experimentService.addTest(params);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });

        it('fail - picture not exist', async () => {

            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const expNameWithoutImage = 'exp2';
            await collectionsService.experiments().add(expNameWithoutImage, {});
            const tables = {word_table: word_table, sentences_table: sent_table};
            params.experimentName =  expNameWithoutImage;

            pythonService.setGenTableFromEyezResult(tables);

            const {status, error} = await experimentService.addTest(params);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.IM_NOT_EXISTS);

        });

        it('fail - word_ocr does not exist', async () => {
            const expNameWithoutWord_ocr = 'exp2';
            const imageNameWithoutWord_ocr = 'im2';
       
            const word_ocr_path = `images/${imageNameWithoutWord_ocr}/word_ocr`;
            const base_sent_table_path = `images/${imageNameWithoutWord_ocr}/base_sent_table`;

            await collectionsService.experiments().add(expNameWithoutWord_ocr, {'imageName':imageNameWithoutWord_ocr});
            await collectionsService.images().add(imageNameWithoutWord_ocr, {
                base_sent_table_path: base_sent_table_path,
                name: imageNameWithoutWord_ocr,
                word_ocr_path: word_ocr_path
             });

            await storageService.uploadBuffer(base_sent_table_path,new Buffer("sent_table"),fileTypes.Csv);
      
            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const tables = {word_table: word_table, sentences_table: sent_table};

            params.experimentName =  expNameWithoutWord_ocr;

            pythonService.setGenTableFromEyezResult(tables);
            
            const {status, error} = await experimentService.addTest(params);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual('word_ocr does not exist');

        });


        it('fail - base_sentences_table does not exist', async () => {
            const expNameWithoutWord_ocr = 'exp2';
            const imageNameWithoutWord_ocr = 'im2';
       
            const word_ocr_path = `images/${imageNameWithoutWord_ocr}/word_ocr`;
            const base_sent_table_path = `images/${imageNameWithoutWord_ocr}/base_sent_table`;
     

            await collectionsService.experiments().add(expNameWithoutWord_ocr, {'imageName':imageNameWithoutWord_ocr});
            await collectionsService.images().add(imageNameWithoutWord_ocr, {
                base_sent_table_path: base_sent_table_path,
                name: imageNameWithoutWord_ocr,
                word_ocr_path: word_ocr_path

             });

            await storageService.uploadBuffer(word_ocr_path,new Buffer("word_table"),fileTypes.Csv);
      
            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const tables = {word_table: word_table, sentences_table: sent_table};
     
            params.experimentName = expNameWithoutWord_ocr;

            pythonService.setGenTableFromEyezResult(tables);
            
            const {status, error} = await experimentService.addTest(params);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual('base_sentences_table does not exist');

        });

        it('fail - test id already exist', async () => {

            const word_table = new Buffer('word_table');
            const sent_table = new Buffer('sent_table');
            const tables = {word_table: word_table, sentences_table: sent_table};
            pythonService.setGenTableFromEyezResult(tables);

            const expUploadPaths = 
                {
                sent_table_path:`experiments/${params.experimentName}/tests/${params.testId}/testSentTables`,
                word_table_path:`experiments/${params.experimentName}/tests/${params.testId}/testWordTables`
                }

            await collectionsService.experiments().getTests(params.experimentName).add(params.testId,{
                testId:params.testId,
                formId: params.formId,
                sent_table_path: expUploadPaths.sent_table_path ,
                word_table_path: expUploadPaths.sent_table_path,
            });

            const {status, error} = await experimentService.addTest(params);
            expect(status).toEqual(ERROR_STATUS.NAME_NOT_VALID);
            expect(error).toEqual(ERRORS.TEST_EXISTS);
     
        });
    });

    
    describe('get Filtered Test' , () => {
        const expName = 'exp1';
        const imageName = 'im1';
       
        const word_ocr_path = `images/${imageName}/word_ocr`;
        const base_sent_table_path = `images/${imageName}/base_sent_table`;
        
        const params1={
            testId: 'testId1',
            formId : '5',
            answers : '5',
            score : '5',
            sentanceWeights : '5',
            experimentName: expName,
            fixations: 'buffer' 
        };    
        const params2={
            testId: 'testId2',
            formId : '5',
            answers : '5',
            score : '2',
            sentanceWeights : '5',
            experimentName: expName,
            fixations: 'buffer' 
        }; 

      
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {});
            await collectionsService.experiments().getTests(expName).add(params1.testId,params1);
            await collectionsService.experiments().getTests(expName).add(params2.testId,params2);
        });

        it('success- minScore less than 2 tests', async () => {
           const res = await  experimentService.getFilteredTest(expName,5,1)
           expect(res.data.length).toEqual(2);
        });

        it('success- minScore less than 1 tests', async () => {
            const res = await  experimentService.getFilteredTest(expName, 5,4);
            expect(res.data.length).toEqual(1);
         });

         it('success- minScore less than 0 tests', async () => {
            const res = await  experimentService.getFilteredTest(expName, 5,6);
            expect(res.data.length).toEqual(0);
         });

         it('success- minScore less than 1 tests, formId is undefined', async () => {
            const res = await  experimentService.getFilteredTest(expName, undefined,2);
            expect(res.data.length).toEqual(1);
         });

         it('success- minScore undefined, return 2 tests that belong to formId 2', async () => {
            const res = await  experimentService.getFilteredTest(expName, 5,undefined);
            expect(res.data.length).toEqual(2);
         });

         it('fail- experiment name not exist', async () => {
            const {status, error} = await  experimentService.getFilteredTest('notExist', 5,6);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
         });

    });


    describe('add form Test' , () => {
        const expName = 'exp1';
        const imageName = 'im1';
       
        const word_ocr_path = `images/${imageName}/word_ocr`;
        const base_sent_table_path = `images/${imageName}/base_sent_table`;
        
        const params1={
            testId: 'testId1',
            formId : '5',
            answers : '5',
            score : '5',
            sentanceWeights : '5',
            experimentName: expName,
            fixations: 'buffer' 
        };    

        const FormsParams={
            experimentName: expName,
            name: 'form1',
            questionsIds: [1,2,3],
            isRankSentences: 'false',
            isFillAnswers: 'true',
            withFixations: 'true'
        }
        const FormsParamsNotExist={
            experimentName: 'notExist',
            name: 'form1',
            questionsIds: [1,2,3],
            isRankSentences: 'false',
            isFillAnswers: 'true',
            withFixations: 'true'
        }
                   
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {});
        });

        it('success- add one form', async () => {
           const res = await experimentService.addForm(FormsParams);
           expect(res.status).toEqual(0);
           const form =  await collectionsService.experiments().formsOf(FormsParams.experimentName).get(FormsParams.name)
           expect(form).toBeDefined;
           expect(form.name).toBe(FormsParams.name);
        });

        it('fail- experiment name not exist', async () => {
            const {status, error} = await experimentService.addForm(FormsParamsNotExist);
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
         });

         it('fail- form name already exist', async () => {
            await collectionsService.experiments().formsOf(FormsParams.experimentName).add(FormsParams.name,{
                name: FormsParams.name,
                questionsIds: FormsParams.questionsIds || [],
                isRankSentences : FormsParams.isRankSentences,
                isFillAnswers : FormsParams.isFillAnswers ,
                withFixations : FormsParams.withFixations ,
                creation_date: Date.now(),
            });

            const {status, error} = await experimentService.addForm(FormsParams);
            expect(status).toEqual(ERROR_STATUS.NAME_NOT_VALID);
            expect(error).toEqual(ERRORS.FORM_EXISTS);
         });
    });

    describe('get all tests' , () => {
        const expName = 'exp1';
        const expNameNotExist = 'notExist';
        const FormsParams1={
            experimentName: expName,
            name: 'form1',
            questionsIds: [1,2,3],
            isRankSentences: 'false',
            isFillAnswers: 'true',
            withFixations: 'true'
        }
        const FormsParams2={
            experimentName: expName,
            name: 'form2',
            questionsIds: [1,2,3],
            isRankSentences: 'false',
            isFillAnswers: 'true',
            withFixations: 'true'
        }
        beforeEach( async () => {
            await collectionsService.experiments().add(expName, {});
            await collectionsService.experiments().formsOf(expName).add(FormsParams1.name, FormsParams1);
            await collectionsService.experiments().formsOf(expName).add(FormsParams2.name, FormsParams2);
        });

        it('success- getAll return 2 forms', async () => {
            const res = await experimentService.getAllForms(expName)
            expect(res.status).toEqual(0);
            expect(res.data.length).toEqual(2);     
        });

        it('fail- experiment name not exist', async () => {
            const {status, error} = await experimentService.getAllForms(expNameNotExist)
            expect(status).toEqual(ERROR_STATUS.OBJECT_NOT_EXISTS);
            expect(error).toEqual(ERRORS.EXP_NOT_EXISTS);
        });
    });

});