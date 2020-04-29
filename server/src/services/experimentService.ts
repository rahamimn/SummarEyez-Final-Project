import { SentTable } from './collections/firebase/dal/sentTables';
import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";
import { PythonScriptInterface } from "./pythonScripts/pythonScriptsTypes";
const forEP = require('foreach-promise');
//@ts-ignore
import {promises as fs} from 'fs';
import * as csvToJson from 'csvtojson';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_STATUS, ERRORS } from '../utils/Errors';

// var isUtf8 = require('is-utf8');

const response = (status,{data=null, error=null}={}) => ({status, data, error});


export class ExperimentService{
    private collectionsService : Collections;
    private storageService: Storage;
    private pythonService: PythonScriptInterface;

    constructor({collectionsService,storageService,pythonService}){
        this.collectionsService = collectionsService;
        this.storageService = storageService;
        this.pythonService = pythonService;
    }

    private intersectAutomaticAlgs(all:{id:string, data:object, disabled?: boolean}[] ,subset: {id:string, data:object}[]){
        const autoAlgs = [];
        all.forEach(auto => {
            const autoCalculated = subset.filter(auto2 => auto2.id === auto.id);

            if(autoCalculated.length === 0){
                autoAlgs.push({...auto, disabled: true})
            }
            else{
                autoAlgs.push({id:auto.id,data:{...auto.data, ...autoCalculated[0].data} , disabled: false})
            }
        });
        return autoAlgs;
    }

    private addAutomaticAlgToImg = async (tables, imageName) => {
        await forEP(tables, async row => {
            const path = `images/${imageName}/algs/${row.name}`;
            await this.storageService.uploadBuffer(path, row.sent_table, fileTypes.Csv);
            await this.collectionsService.images().sentTablesOf(imageName).add(row.name,{
                type: 'auto',
                name: row.name,
                path,
                creation_date: Date.now()
            });
        });
    }
    private getAutoAlgsSavedLocally = async () => {
        const files = await fs.readdir('./automatic-algorithms');
        let algNames = [];
        if(files.length > 0){
            await forEP(files, async (file:string) => {
                if(file.endsWith('.py')){
                    algNames.push(file);
                }
            });
        }
        return algNames;
    }
 
addTest = async (params) => {
    const experiment= await this.collectionsService.experiments().get(params.experimentName)
    const paramsList = {'testId': params.testId};
    const error = this.validateIds(paramsList);

    if(error != ''){
        return response(ERROR_STATUS.NAME_NOT_VALID,{error} );
    }
    if(!experiment){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
    const picture= await this.collectionsService.images().get(experiment.imageName)
    if(!picture){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.IM_NOT_EXISTS} );
    }
    const word_ocr = await this.storageService.downloadToBuffer(picture.word_ocr_path);
    if(!word_ocr){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: 'word_ocr does not exist'} );
    }
    const base_sentences_table = await this.storageService.downloadToBuffer(picture.base_sent_table_path);
    if(!base_sentences_table){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: 'base_sentences_table does not exist'} );
    }
   
    const test = await this.collectionsService
        .experiments()
        .getTests(params.experimentName)
        .get(params.testId);

    if(test){
        return response(ERROR_STATUS.NAME_NOT_VALID, {error: ERRORS.TEST_EXISTS});
    }


    const tables = await this.pythonService.genTableFromEyez(params.fixations, word_ocr, base_sentences_table);

    const expUploadPaths = {
        sent_table:`experiments/${params.experimentName}/tests/${params.testId}/testSentTables`,
        word_table:`experiments/${params.experimentName}/tests/${params.testId}/testWordTables`
    }
    
    await this.storageService.uploadBuffer(expUploadPaths.word_table, tables.word_table, fileTypes.Text);
    await this.storageService.uploadBuffer(expUploadPaths.sent_table, tables.sentences_table, fileTypes.Text);
    await this.collectionsService.experiments().getTests(params.experimentName).add(params.testId,{
        name: params.testId,
        formId: params.formId,
        answers : params.answers || [],
        score : params.score || 0,
        sentanceWeights : params.sentanceWeights || [],
        creation_date: Date.now(),
        sent_table_path: expUploadPaths.sent_table,
        word_table_path: expUploadPaths.word_table,
        type:'eyes'
    });

    return response(0);    
}

private checkExpiramentExist = async (experimentsNames) => {
    for(var i=0; i<experimentsNames.length; i++){
        var nameOfExpirament = experimentsNames[i]
        const expriment = await this.collectionsService.experiments().get(nameOfExpirament)
        if (!expriment) {
            return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EXISTS})
        }
    }
    return response(0);
}

private checkformsExist = async (experimentsNames, formsId) => {
    for(var i=0; i<experimentsNames.length; i++){
        var nameOfForm = formsId[i]
        var nameOfExpirament = experimentsNames[i]
        var currFrom = await this.collectionsService.experiments().formsOf(nameOfExpirament).get(nameOfForm);
        if (!currFrom) {
            return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EXISTS})
        }
    }
    return  response(0);
}

addTestPlan = async (testPlanName: any, formsDetails: any) =>{
    var expiramentNames = formsDetails.map(expiramentName => expiramentName.formExpiramentName);
    var formsId = formsDetails.map(formDetail => formDetail.formIds);
    const validExpiraments = await this.checkExpiramentExist(expiramentNames);
    if(validExpiraments.status === ERROR_STATUS.NAME_NOT_VALID )
    {
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error: ERRORS.EXP_NOT_EXISTS})
    }
    const validFroms = await this.checkformsExist(expiramentNames, formsId);
    if(validFroms.status === ERROR_STATUS.NAME_NOT_VALID )
    {
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error: ERRORS.FORM_NOT_EXISTS})
    }

    const testPlanNameExist = await this.collectionsService.testPlans().get(testPlanName);

    if(testPlanNameExist)
    {
        return response(ERROR_STATUS.NAME_NOT_VALID, {error: ERRORS.TEST_PLAN_NAME_EXISTS})
    }
    await this.collectionsService.testPlans().add(testPlanName, {
        name: testPlanName,
        forms: formsId,
        expiraments: expiramentNames,
        creation_date: Date.now(),
    })
    return response(0);
}

addForm = async (params) =>{
    const expriment = await this.collectionsService.experiments().get(params.experimentName)
    if(!expriment){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
    const form = await this.collectionsService.experiments().formsOf(params.experimentName).get(params.name);
    if(form){
        return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_EXISTS} );
    }
    await this.collectionsService.experiments().formsOf(params.experimentName).add(params.name,{
        name: params.name,
        questionsIds: params.questionsIds || [],
        isRankSentences : params.isRankSentences,
        isFillAnswers : params.isFillAnswers ,
        withFixations : params.withFixations ,
        creation_date: Date.now(),
    });
    return response(0);
}

getAllForms = async (experimentName) =>{
    const expriment = await this.collectionsService.experiments().get(experimentName)
    if(!expriment){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
    const forms = await this.collectionsService.experiments().formsOf(experimentName).getAll();
    return response(0, {data: forms});
}

getFilteredTest = async (experimentName, formId, minScore) =>{
    const experiment= await this.collectionsService.experiments().get(experimentName)
    if(!experiment){
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }

    var tests =  await this.collectionsService.experiments().getTests(experimentName).getAll();
    tests = tests.filter (test => (!formId || test.data.formId == formId) &&
            (!minScore || test.data.score > minScore))

    return response(0, {data: tests});
    }

    addImage = async (name, buffer) => {
        const image = await this.collectionsService.images().get(name);
        if(image){
            return response(ERROR_STATUS.NAME_NOT_VALID, {error:ERRORS.IM_EXISTS});
        }
        const ans= this.validateIds({'name': name});
        if(ans != ''){
            return response(-1,{error: ans} );
        }

        const files = await this.pythonService.processImage(buffer)
        await this.storageService.uploadBuffer(`images/${name}/image`, buffer, fileTypes.Image);
        await this.storageService.uploadBuffer(`images/${name}/text`, files.text, fileTypes.Text);
        await this.storageService.uploadBuffer(`images/${name}/word_ocr`, files.word_ocr, fileTypes.Csv);
        await this.storageService.uploadBuffer(`images/${name}/base_sent_table`, files.base_sent_table, fileTypes.Csv);
        await this.collectionsService.images().add(name,{
            name,
            uploaded_date: Date.now(),
            image_path: `images/${name}/image`,
            text_path: `images/${name}/text`,
            word_ocr_path: `images/${name}/word_ocr`,
            base_sent_table_path: `images/${name}/base_sent_table`,
        });

        const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally();
        //we should fetch newly algorithms 
        const allAutomaticAlgs: string[] = await this.collectionsService.automaticAlgos().getAll();
        if(allAutomaticAlgs.length > 0){
            await forEP(allAutomaticAlgs, async (metaAuto) => {
                const autoName = metaAuto.data.name;
                if(allAutomaticAlgs.includes(autoName)){
                    return;
                }
                await this.storageService.downloadToPath(
                    metaAuto.data.path,
                    `./automatic-algorithms/${autoName}`
                )
                automaticAlgsSavedLocally.push(autoName)
            });
        }
    
        const {tables} = await this.pythonService.runAutomaticAlgs(
            automaticAlgsSavedLocally,
            files.text,
            files.base_sent_table);
        await this.addAutomaticAlgToImg(tables,name);

        return response(0);
    }

    getImages = async () => {
        const imagesCollection = await this.collectionsService.images();
        const images  = await imagesCollection.getAll();

        return images;
    }

    getExperiments = async () => {
        const experiments = await this.collectionsService.experiments().getAll();
        return response(0, {data: experiments});
    }

    getAllQuestions= async(experimentName: any) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }
        const questionsOfImage = await this.collectionsService.images().questionsOf(experiment.imageName).getAll();
        return response(0,{data: questionsOfImage})
    }

    //precondition: experiment metadata exists.
    private getSentTableFile = async (experiment, type, name) => {
        let path;

        if(type === 'auto'){
            const autoSentTable = await this.collectionsService.images().sentTablesOf(experiment.imageName).get(name);
            if(!autoSentTable){
                return null;
            }
            path = autoSentTable.path;
        }

        if(type === 'merged'){
            const mergedSentTable = await this.collectionsService.experiments().mergedSentOf(experiment.name).get(name);
            if(!mergedSentTable){
                return null;
            }
            path = mergedSentTable.path;
        }

        if(type === 'eyes'){
            const testSentTable = await this.collectionsService.experiments().getTests(experiment.name).get(name);
            if(!testSentTable){
                return null;
            }
            path = testSentTable.sent_table_path;
        }
        
        return await this.storageService.downloadToBuffer(path);
    }

    getSummary = async (experimentName, type, name) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const csvFile = await this.getSentTableFile(experiment, type, name);
        if(!csvFile){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error:ERRORS.SUMMARY_NOT_EXISTS})
        }

        return response(0, {
            data: {
                title: experiment.imageName,
                summary: await csvToJson({delimiter:'auto'}).fromString(csvFile.toString('utf16le'))
            }
        });
    }

    getSummaries = async (experimentName)=> {
        // const eyesExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const autoSentTables = await this.collectionsService.images().sentTablesOf(experiment.imageName).getAll();
        const allAutomaticAlgs = await this.collectionsService.automaticAlgos().getAll();
        const allMergedTables = await this.collectionsService.experiments().mergedSentOf(experimentName).getAll();
        const allTestsTable = await this.collectionsService.experiments().getTests(experimentName).getAll();

        return response(0, {
            data:{
                auto: this.intersectAutomaticAlgs(allAutomaticAlgs, autoSentTables),
                eyes: allTestsTable,
                merged: allMergedTables,
            }
        });
    }

    //TODO - check if exists download if needed
    // we could check with in memory data
    private verifyAutomaticAlgorithmExists = async (names: string[]) => {
        const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally();
        //we should fetch newly algorithms 
        await forEP(names, async name => {
            const metaAuto = await this.collectionsService.automaticAlgos().get(name);
            if(!automaticAlgsSavedLocally.includes(name)){
                await this.storageService.downloadToPath(
                    metaAuto.path,
                    `./automatic-algorithms/${name}`
                )
            }
        });
    };

runAutomaticAlgs = async (algsNames: string[], experimentName:string ) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        };
            
        const imageName =  experiment.imageName;
        const text = await this.storageService.downloadToBuffer(`images/${imageName}/text`);
        const base_sent_table = await this.storageService.downloadToBuffer(`images/${imageName}/base_sent_table`);
        await this.verifyAutomaticAlgorithmExists(algsNames);
        const {tables} = await this.pythonService.runAutomaticAlgs(algsNames, text,base_sent_table);
        await this.addAutomaticAlgToImg(tables,imageName);
        return response(0);
    }

    addAutomaticAlgorithms = async (name: string, buffer) => {
        const error = this.validateIds({'name': name});
        if(error != ''){
            return response(ERROR_STATUS.NAME_NOT_VALID, {error} );
        }
        const formattedName = name.endsWith('.py') ? name :  (name+'.py');
        const path = `automatic-algos/${formattedName}`
        await this.storageService.uploadBuffer(path, buffer, fileTypes.Text);
        if (await this.collectionsService.automaticAlgos().get(formattedName) != undefined){
            return response(ERROR_STATUS.NAME_NOT_VALID,{ error: ERRORS.AlG_EXISTS });
        }
        else{
            await this.collectionsService.automaticAlgos().add(formattedName,{
                name: formattedName,
                path,
                uploaded_date: Date.now()
            });
            return response(0);
        }
    };

    addExperiment = async (experimentName, imageName)=>{
        const paramsList= {'experimentName': experimentName, 'imageName': imageName};
        const error = this.validateIds(paramsList);
        if(error != ''){
            return response(ERROR_STATUS.NAME_NOT_VALID,{error} );
        }
        if(await this.collectionsService.experiments().get(experimentName)){
            return response(ERROR_STATUS.NAME_NOT_VALID,{ error: ERRORS.EXP_EXISTS});
        }
        await this.collectionsService.experiments().add(experimentName,{
            name: experimentName, imageName
        });
        return response(0);
    }


    addQuestion = async (experimentName,question, answers, correctAnswer)=>{
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }
        
        if(correctAnswer >4 || correctAnswer <0){
            return response(ERROR_STATUS.GENERAL_ERROR,{error: "the value of the correct answer is not valid"});
        }
        const experimentImageName = experiment.imageName;
        await this.collectionsService.images().questionsOf(experimentImageName).add(uuidv4(), {
            question: question,
            answers,
            correctAnswer: correctAnswer,
            creation_date: Date.now()
        }); 
        return response(0);
    }

    mergeSummaries = async(experimentName, mergedName, sammaries_details ) =>{

        if(sammaries_details.length ==0){
            return response(ERROR_STATUS.GENERAL_ERROR,{error: "no summaries input provided"});
        }
        var percents = sammaries_details.map(sammary => sammary.percentage)
        var names = sammaries_details.map(sammary => sammary.name)
        var types = sammaries_details.map(sammary => sammary.type);

        const expriment = await this.collectionsService.experiments().get(experimentName)
        if(!expriment){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }   

        const image = await this.collectionsService.images().get(expriment.imageName)
        const base_sent_table = await this.storageService.downloadToBuffer(image.base_sent_table_path);

        const {status, data: sent_tables}  = await this.sent_table_initializer(names,types, expriment);
        if(status !== 0){
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.SUMMARY_NOT_EXISTS});
        }

        var {merged_table} = await this.pythonService.mergeTables(percents, sent_tables ,base_sent_table )  
        
        const path = `experiments/${experimentName}/merged-sent/${mergedName}`
        await this.storageService.uploadBuffer(path, merged_table, fileTypes.Csv);
        await this.collectionsService.experiments().mergedSentOf(experimentName).add(mergedName,{
            type: 'merged',
            name: mergedName,
            mergedInput : sammaries_details,
            path,
            creation_date: Date.now()
        });

        return response(0,{
            data: await csvToJson({delimiter:'auto'}).fromString(merged_table.toString())
        });
    }


    private async sent_table_initializer(names: string[],types: string [], experiment: any) {
        const sent_tables = []
        for(var i=0; i<names.length; i++){
            var name = names[i]
            var new_sent_table = await this.getSentTableFile(experiment, types[i], name);
            if (!new_sent_table) {
                return {
                    status: -1,
                };
            }
            //the sammary name is found
            else {
                await sent_tables.push(new_sent_table);
            }
        }
 
        return {
            status: 0,
            data:sent_tables
        };
    }
    private validateIds(paramsList){
        let ans = '';
        for(var param in paramsList){
            var val = paramsList[param];
            if(val =='')
                return param + ' is empty string';
            if(val =='.')
                return param + ' should not be equal to: .';
            if(val =='..')
                return param + ' should not be equal to: ..';
            if(val.includes('/'))
                return param + ' should not contain: /';
            // if(!isUtf8(val))
            //     return param + ' : ' + val +' contain not utf-8 char';    
        }
        return ans;
    }
}