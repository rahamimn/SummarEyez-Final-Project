import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";
import { PythonScriptInterface } from "./pythonScripts/pythonScriptsTypes";
const forEP = require('foreach-promise');
import { addToSystemFailierLogger, addToErrorLogger, addToRegularLogger } from "../Collections/../controller/system_loggers";
//@ts-ignore
import {promises as fs} from 'fs';
import * as csvToJson from 'csvtojson';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_STATUS, ERRORS } from '../utils/Errors';

const { Parser } = require('json2csv');
// var isUtf8 = require('is-utf8');

const response = (status,{data=null, error=null}={}) => ({status, data, error});
var groupBy = require('lodash.groupby');

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
        if(tables.length > 0){
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

addRatingAnswers = async (testPlanId, testId, rateSummariesAnswers) => {
    addToRegularLogger("addRatingAnswers", {testPlanId, testId, rateSummariesAnswers})
    const testPlan = await this.collectionsService.testPlans().get(testPlanId);
    if(!testPlan){
        addToErrorLogger("addRatingAnswers")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error:ERRORS.TEST_PLAN_NAME_NOT_EXISTS});
    }
    await this.collectionsService.testPlans().ratingAnswersOf(testPlanId).add(testId,{
        testPlanId :testPlanId,
        testId: testId,
        answers: rateSummariesAnswers
    });

    return response(0);
}
 
addTest = async (params) => {
    addToRegularLogger("addTest", {params})
    const experiment= await this.collectionsService.experiments().get(params.experimentName)
    const paramsList = {'testId': params.testId};
    const error = this.validateIds(paramsList);
    
    if(error != ''){
        addToErrorLogger("addTest")
        return response(ERROR_STATUS.NAME_NOT_VALID,{error} );
    }
    if(!experiment){
        addToErrorLogger("addTest")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
  
    const img= await this.collectionsService.images().get(experiment.imageName)
    if(!img){
        addToErrorLogger("addTest")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.IM_NOT_EXISTS} );
    }
 
    const test = await this.collectionsService
        .experiments()
        .getTests(params.experimentName)
        .get(params.testId);

    if(test){
        addToErrorLogger("addTest")
        return response(ERROR_STATUS.NAME_NOT_VALID, {error: ERRORS.TEST_EXISTS});
    }

    let baseTestData = {};

    if(params.fixations){
        const word_ocr = await this.storageService.downloadToBuffer(img.word_ocr_path);
        if(!word_ocr){
            addToErrorLogger("addTest")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.WORD_OCR_TBL_NOT_EXISTS} );
        }
        const base_sentences_table = await this.storageService.downloadToBuffer(img.base_sent_table_path);
        if(!base_sentences_table){
            addToErrorLogger("addTest")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.SENT_TBL_NOT_EXISTS} );
        }
   
        if(params.testPlanId && params.testPlanId != -1){
            const testPlanNameExist = await this.collectionsService.testPlans().get(params.testPlanId);
            if(!testPlanNameExist){
                addToErrorLogger("addTest")
                return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.TEST_PLAN_NAME_NOT_EXISTS} );  
            }
        }

        const tables = await this.pythonService.genTableFromEyez(params.fixations, word_ocr, base_sentences_table);

        const expUploadPaths = {
            sent_table:`experiments/${params.experimentName}/tests/${params.testId}/testSentTables`,
            word_table:`experiments/${params.experimentName}/tests/${params.testId}/testWordTables`
        }
        await this.storageService.uploadBuffer(expUploadPaths.word_table, tables.word_table, fileTypes.Text);
        await this.storageService.uploadBuffer(expUploadPaths.sent_table, tables.sentences_table, fileTypes.Text);
        baseTestData = {
            sent_table_path: expUploadPaths.sent_table,
            word_table_path: expUploadPaths.word_table,
        }
    }

    const form = await this.collectionsService.experiments().formsOf(params.experimentName).get(params.formId);
    if(form){
        const answers = params.answers
        const questions = form.questionIds
        var score = params.score;

        // check for not devide by zero
        if(questions.length != 0 ){
            var correctAns = 0
            for (let index = 0; index < questions.length; index++) { 
                const question = await this.collectionsService.images().questionsOf(img.name).get((answers[index].id))
                if(question.correctAnswer == answers[index].ans) {
                    correctAns++;
                }
            }
            score = (correctAns / questions.length) * 100;
        }

        form.editable = false;

        await this.collectionsService.experiments().formsOf(params.experimentName).add(form.name,form)
    }
  

    await this.collectionsService.experiments().getTests(params.experimentName).add(params.testId,{
        ...baseTestData,
        name: params.testId,
        formId: params.formId,
        answers : params.answers || [],
        score : score || 0,
        sentanceWeights : params.sentanceWeights || [],
        creation_date: Date.now(),
        type:'eyes',
        testPlanId: params.testPlanId
    });
    return response(0);    
}

private checkExpiramentExist = async (experimentsNames) => {
    for(var i=0; i<experimentsNames.length; i++){
        var nameOfExpirament = experimentsNames[i]
        const expriment = await this.collectionsService.experiments().get(nameOfExpirament)
        if (!expriment) {
            addToErrorLogger("checkExpiramentExist")
            return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EXISTS})
        }
    }
    return response(0);
}

private checkFormsExist = async (experimentsNames, formsId) => {
    for(var i=0; i<experimentsNames.length; i++){
        var nameOfForm = formsId[i]
        var nameOfExpirament = experimentsNames[i]
        var currFrom = await this.collectionsService.experiments().formsOf(nameOfExpirament).get(nameOfForm);
        if (!currFrom) {
            addToErrorLogger("checkFormsExist")
            return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EXISTS})
        }
    }
    return  response(0);
}

addTestPlan = async (testPlanName: any, withRateSummaries: boolean, formsDetails: any) =>{
    addToRegularLogger("addTestPlan", {testPlanName, withRateSummaries, formsDetails})
    var experimentNames  = formsDetails.map(formDetail => formDetail.experimentName);
    var formIds = formsDetails.map(formDetail => formDetail.formId);

    const validExpiraments = await this.checkExpiramentExist(experimentNames );
    if(validExpiraments.status === ERROR_STATUS.NAME_NOT_VALID )
    {
        addToErrorLogger("addTestPlan")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error: ERRORS.EXP_NOT_EXISTS})
    }
    const validFroms = await this.checkFormsExist(experimentNames , formIds);
    if(validFroms.status === ERROR_STATUS.NAME_NOT_VALID )
    {
        addToErrorLogger("addTestPlan")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error: ERRORS.FORM_NOT_EXISTS})
    }

    const testPlanNameExist = await this.collectionsService.testPlans().get(testPlanName);

    if(testPlanNameExist)
    {
        addToErrorLogger("addTestPlan")
        return response(ERROR_STATUS.NAME_NOT_VALID, {error: ERRORS.TEST_PLAN_NAME_EXISTS})
    }
    await this.collectionsService.testPlans().add(testPlanName, {
        id: testPlanName,
        withRateSummaries,
        forms: formsDetails
    })
    return response(0);
}

testOfTestPlan = async (testPlanId, csv) =>{
    addToRegularLogger("testOfTestPlan", {testPlanId, csv})
    const testPlan = await this.collectionsService.testPlans().get(testPlanId);

    if(!testPlan){
        addToErrorLogger("testOfTestPlan")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error: ERRORS.TEST_PLAN_NAME_NOT_EXISTS})
    }
    var jsonAns = []

    for (let index = 0; index < testPlan.forms.length; index++) {
        const form = testPlan.forms[index]; 
        const expName = form.experimentName;
        const formId = form.formId;
        const tests = await this.collectionsService.experiments().getTests(expName).getAll()
        for (let j = 0; j < tests.length; j++) { 
            const {data} = tests[j];
            if(data.testPlanId === testPlan.id && data.formId === formId){
                const testToAdd = tests[j]
                jsonAns = jsonAns.concat(testToAdd)
            }
        } 
    }  



    jsonAns = groupBy(jsonAns, (test) => test.id);


    let summaryRatings = null;
    if(testPlan.withRateSummaries){
        summaryRatings = await this.collectionsService.testPlans().ratingAnswersOf(testPlanId).getAll();
    }

    jsonAns = Object.entries(jsonAns).map(entry => ({
        testId: entry[0],
        tests: entry[1],
        rating: summaryRatings && summaryRatings.find(rating => rating.id === entry[0]).data
    }))
    var csvRes
    if(csv === true){
        try{
            if(jsonAns.length === 0){
                addToErrorLogger("testOfTestPlan")
                return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{ error:ERRORS.TEST_NOT_EXISTS});
            }
            const testsSamp = jsonAns[0].tests
            const testData = (entry,ind) => entry.tests[ind].data;

            var fields =[{label: 'student ID' , value: (entry) => entry.testId }];

            testsSamp.forEach((test, index) => {
                fields = [...fields,
                    {label: 'form ID' , value: (entry) => testData(entry,index).formId },
                    {label: 'experiment ID' , value: (entry) => {
                        const formId = testData(entry,index).formId;
                        return testPlan.forms.find(form => form.formId ===  formId).experimentName;
                    }}
                ];
                if(test.data.answers && test.data.answers.length > 0){
                    fields.push({label: `[${test.data.formId}]-score`, value: (entry) => testData(entry,index).score})
                    test.data.answers.forEach((ans, i) => fields = [
                        ...fields,
                        {label: `[${test.data.formId}]-q${i}` , value: (entry) => testData(entry,index).answers[i].id},
                        {label: `[${test.data.formId}]-q${i} answer` , value: (entry) => testData(entry,index).answers[i].ans},
                        {label: `[${test.data.formId}]-q${i} time` , value: (entry) => testData(entry,index).answers[i].time} 
                    ]);
                }
            });
            if(summaryRatings){
                const summariesRatesSamp = jsonAns[0].rating.answers.summariesRate;

                fields = [...fields, {
                    label: 'Top Summary[<form>/<experimnet>]',
                    value: (entry => {
                        const summary = entry.rating.answers.topSummary;
                        return  `${summary.formName}/${summary.experimentName}`
                    })
                },
                {
                    label: 'Worst Summary [<form>/<experimnet>]',
                    value: (entry => {
                        const summary = entry.rating.answers.worstSummary;
                        return  `${summary.formName}/${summary.experimentName}`
                    })
                },
                ...testPlan.forms.map((form,i) => summariesRatesSamp[i] && ({
                    label: `Rate of ${form.formId}/${form.experimentName}`,
                    value: entry => entry.rating.answers.summariesRate[i].rate
                })).filter(x => x)
                ]
            }
        

            var opts = { fields };
            var parser = new Parser(opts);
            var csvRes = parser.parse(jsonAns);
            //console.log( csvRes);
        }
        catch (err){
            addToSystemFailierLogger("testOfTestPlan")
            console.error(err);
        }
    }
    
    return response(0, {data:{json: jsonAns, csv: csvRes}});
}



getAllTestPlans = async () =>{
    addToRegularLogger("getAllTestPlans", {})
    const allTestPlans = await this.collectionsService.testPlans().getAll();
    return response(0, {data: allTestPlans});
}

getTestPlan= async (testPlanId: any) =>{  
    addToRegularLogger("getTestPlan", {testPlanId})
    const testPlan = await this.collectionsService.testPlans().get(testPlanId);
    if(!testPlan)
    {
        addToErrorLogger("getTestPlan")
        return response(ERRORS.TEST_PLAN_NAME_NOT_EXISTS, {error: ERRORS.TEST_PLAN_NAME_NOT_EXISTS})
    }

    return response(0, {data: testPlan});
}

addForm = async (params) =>{
    addToRegularLogger("addForm", {params})
    const expriment = await this.collectionsService.experiments().get(params.experimentName)
    if(!expriment){
        addToErrorLogger("addForm")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
    const form = await this.collectionsService.experiments().formsOf(params.experimentName).get(params.name);
    if(form){
        addToErrorLogger("addForm")
        return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_EXISTS} );
    }
    await this.collectionsService.experiments().formsOf(params.experimentName).add(params.name,{
        name: params.name,
        questionIds: params.questionIds || [],
        summary: params.summary || {},
        isRankSentences : params.isRankSentences || false,
        isReadSummary : params.isReadSummary || false,
        isFillAnswers : params.isFillAnswers || false,
        withFixations : params.withFixations || false,
        editable : true,
        creation_date: Date.now(),
    });
    return response(0);
}

updateForm = async (params) =>{
    addToRegularLogger("updateForm", {params})
    const expriment = await this.collectionsService.experiments().get(params.experimentName)
    if(!expriment){
        addToErrorLogger("updateForm")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }

    const form = await this.collectionsService.experiments().formsOf(params.experimentName).get(params.name);
    if(!form){
        addToErrorLogger("updateForm")
        return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EXISTS} );
    }
   
    if(!form.editable){
        addToErrorLogger("updateForm")
        return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.FORM_NOT_EDITABLE} );
    }

    await this.collectionsService.experiments().formsOf(params.experimentName).add(params.name,{
        name: params.name ,
        questionIds: params.questionIds ,
        summary: params.summary ,
        isRankSentences : params.isRankSentences ,
        isReadSummary : params.isReadSummary ,
        isFillAnswers : params.isFillAnswers ,
        withFixations : params.withFixations ,
        editable : true,  
        creation_date: form.creation_date,
    });

    return response(0);
}


getAllForms = async (experimentName) =>{
    addToRegularLogger("getAllForms", {experimentName})
    const expriment = await this.collectionsService.experiments().get(experimentName)
    if(!expriment){
        addToErrorLogger("getAllForms")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }
    const forms = await this.collectionsService.experiments().formsOf(experimentName).getAll();
    return response(0, {data: forms});
}

getForm = async (experimentName, formId, onlyMeta = false) =>{
    addToRegularLogger("getForm", {experimentName, formId})
    const expriment = await this.collectionsService.experiments().get(experimentName)
    if(!expriment){
        addToErrorLogger("getForm")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }

    const form = await this.collectionsService.experiments().formsOf(experimentName).get(formId);
    if(!form){
        addToErrorLogger("getForm")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.FORM_NOT_EXISTS} );
    }

    const img= await this.collectionsService.images().get(expriment.imageName)
    if(!img){
        addToErrorLogger("getForm")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.IM_NOT_EXISTS} );
    }

    if(onlyMeta){
        return response(0, {data: form});
    }
    else{
        var base_sentences_table;
        if(form.isRankSentences == true){
            base_sentences_table = await this.storageService.downloadToBuffer(img.base_sent_table_path);
            if(!base_sentences_table){
                addToErrorLogger("getForm")
                return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.SENT_TBL_NOT_EXISTS} );
            }
            base_sentences_table = await csvToJson({delimiter:'auto'}).fromString(base_sentences_table.toString('utf16le'))
        }
        
        var questions = []
        var questionIds = form.questionIds;
        for (let index = 0; index < questionIds.length; index++) { 
           const question = await this.collectionsService.images().questionsOf(img.name).get((questionIds[index]))
           questions = questions.concat(question); 
        }
    
        var res = {...form,
                    questions: questions,
                    base_sentences_table: base_sentences_table}
    
        return response(0, {data: res});
    }
}

getFilteredTest = async (experimentName, formId, minScore) =>{
    addToRegularLogger("getFilteredTest", {experimentName, formId, minScore})
    const experiment= await this.collectionsService.experiments().get(experimentName)
    if(!experiment){
        addToErrorLogger("getFilteredTest")
        return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
    }

    var tests =  await this.collectionsService.experiments().getTests(experimentName).getAll();
    tests = tests.filter (test => (!formId || test.data.formId == formId) &&
            (!minScore || test.data.score > minScore))

    return response(0, {data: tests});
    }

    addImage = async (name, buffer) => {
        addToRegularLogger("addImage", {name, buffer})
        const image = await this.collectionsService.images().get(name);
        if(image){
            addToErrorLogger("addImage")
            return response(ERROR_STATUS.NAME_NOT_VALID, {error:ERRORS.IM_EXISTS});
        }
        const ans= this.validateIds({'name': name});
        if(ans != ''){
            addToErrorLogger("addImage")
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

        try{

            const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally();

            //we should fetch newly algorithms 
            const allAutomaticAlgs: string[] = await this.collectionsService.automaticAlgos().getAll();
            const existingShouldRunAlgs = [];
            if(allAutomaticAlgs.length > 0){
                await forEP(allAutomaticAlgs, async (metaAuto) => {
                    const autoName = metaAuto.data.name;
                    try{
                        if(!automaticAlgsSavedLocally.includes(autoName)){
                            await this.storageService.downloadToPath(
                                metaAuto.data.path,
                                `./automatic-algorithms/${autoName}`
                            )
                        }
                        existingShouldRunAlgs.push(autoName);
                    }
                    catch(e){
                        addToSystemFailierLogger("addImage")
                      console.error(`${autoName} not exists in server`);
                    }
                });
            }
        
            const {tables} = await this.pythonService.runAutomaticAlgs(
                existingShouldRunAlgs,
                files.text,
                files.base_sent_table);
            if(tables.length> 0){
                await this.addAutomaticAlgToImg(tables,name);
            }
        }
        catch(e){
            addToSystemFailierLogger("addImage")
            console.error('addImage-run-automatic-failed');
        }

        return response(0);
    }

    getImages = async () => {
        addToRegularLogger("getImages", {})
        const imagesCollection = await this.collectionsService.images();
        const images  = await imagesCollection.getAll();

        return images;
    }

    getExperiments = async () => {
        addToRegularLogger("getExperiments", {})
        const experiments = await this.collectionsService.experiments().getAll();
        return response(0, {data: experiments});
    }

    getExperimentInfo = async (experimentName: any) => {
        addToRegularLogger("getExperimentInfo", {experimentName})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("getExperimentInfo")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }
        const image = await this.collectionsService.images().get(experiment.imageName);
        const questionsOfImage = await this.collectionsService.images().questionsOf(experiment.imageName).getAll();
        const forms = await this.collectionsService.experiments().formsOf(experimentName).getAll();
        const tests = await this.collectionsService.experiments().getTests(experimentName).getAll();
        const base_sent_table = await this.storageService.downloadToBuffer(image.base_sent_table_path);

        experiment.questionsCounter = questionsOfImage.length;
        experiment.formsCounter = forms.filter(form => form.id !== 'Manually').length;
        experiment.testsCounter = tests.filter(test => test.data.formId !== 'Manually').length;
        experiment.fixationsUploadedCounter = tests.filter(test => test.data.sent_table_path).length;
        experiment.image_path = image.image_path;
        experiment.base_sent_table = await csvToJson({delimiter:'auto'}).fromString(base_sent_table.toString('utf16le'));


        return response(0, {data: experiment});
    }

    getAllQuestions= async(experimentName: any) => {
        addToRegularLogger("getAllQuestions", {experimentName})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("getAllQuestions")
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

        if(type === 'custom'){
            const customSentTable = await this.collectionsService.experiments().customSummariesOf(experiment.name).get(name);
            if(!customSentTable){
                return null;
            }
            path = customSentTable.path;
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

    getSummary = async (experimentName, type, name, asText = false) => {
        addToRegularLogger("getSummary", {experimentName, type, name})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("getSummary")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const csvFile = await this.getSentTableFile(experiment, type, name);
        if(!csvFile){
            addToErrorLogger("getSummary")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS, {error:ERRORS.SUMMARY_NOT_EXISTS})
        }

        if(asText){
            return response(0,{data: csvFile.toString('utf16le')});
        }
        return response(0, {
            data: {
                title: experiment.imageName,
                summary: await csvToJson({delimiter:'auto'}).fromString(csvFile.toString('utf16le'))
            }
        });
    }

    addCustomSummary = async (experimentName, summaryName, sentencesWeights) => {
        addToRegularLogger("addCustomSummary", {experimentName, summaryName, sentencesWeights})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("addCustomSummary")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const customSummary = await this.collectionsService.experiments().customSummariesOf(experimentName).get(summaryName);

        if(customSummary){
            addToErrorLogger("addCustomSummary")
            return response(ERROR_STATUS.NAME_NOT_VALID,{error: ERRORS.CUSTOM_SUMMARY_EXISTS} );
        }
        
        const parser = new Parser({delimiter: '\t'});
        const sent_table = parser.parse(sentencesWeights);

        const path = `experiments/${experimentName}/custom-sent-table/${summaryName}`;
        await this.storageService.uploadBuffer(path, Buffer.from(sent_table,'utf16le'), fileTypes.Csv);
        await this.collectionsService.experiments().customSummariesOf(experimentName).add(summaryName,{
            type: 'custom',
            name: summaryName,
            path,
            creation_date: Date.now()
        });

        return response(0);
    }

    getSummaries = async (experimentName)=> {
        addToRegularLogger("getSummaries", {experimentName})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("getSummaries")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const autoSentTables = await this.collectionsService.images().sentTablesOf(experiment.imageName).getAll();
        const allAutomaticAlgs = await this.collectionsService.automaticAlgos().getAll();
        const allMergedTables = await this.collectionsService.experiments().mergedSentOf(experimentName).getAll();
        const allTestsTable = await this.collectionsService.experiments().getTests(experimentName).getAll();
        const allCustomTable = await this.collectionsService.experiments().customSummariesOf(experimentName).getAll();

        return response(0, {
            data:{
                auto: this.intersectAutomaticAlgs(allAutomaticAlgs, autoSentTables),
                eyes: allTestsTable.filter(test => test.data.sent_table_path),
                merged: allMergedTables,
                custom: allCustomTable
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
        addToRegularLogger("runAutomaticAlgs", {algsNames, experimentName})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("runAutomaticAlgs")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        };
            
        const imageName =  experiment.imageName;
        const text = await this.storageService.downloadToBuffer(`images/${imageName}/text`);
        const base_sent_table = await this.storageService.downloadToBuffer(`images/${imageName}/base_sent_table`);
        await this.verifyAutomaticAlgorithmExists(algsNames);
        const {tables} = await this.pythonService.runAutomaticAlgs(algsNames, text,base_sent_table);
        if(tables.length > 0){
            await this.addAutomaticAlgToImg(tables,imageName);
        }

        return response(0);
    }

    addAutomaticAlgorithms = async (name: string, buffer) => {
        addToRegularLogger("addAutomaticAlgorithms", {name,buffer})
        const error = this.validateIds({'name': name});
        if(error != ''){
            addToErrorLogger("addAutomaticAlgorithms")
            return response(ERROR_STATUS.NAME_NOT_VALID, {error} );
        }
        const formattedName = name.endsWith('.py') ? name :  (name+'.py');
        const path = `automatic-algos/${formattedName}`
        await this.storageService.uploadBuffer(path, buffer, fileTypes.Text);
        if (await this.collectionsService.automaticAlgos().get(formattedName) != undefined){
            addToErrorLogger("addAutomaticAlgorithms")
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

    addExperiment = async (experimentName, imageName, description)=>{
        addToRegularLogger("addExperiment", {experimentName, imageName, description})
        const paramsList= {'experimentName': experimentName, 'imageName': imageName};
        const manuallyFormName = 'Manually';

        const error = this.validateIds(paramsList);
        if(error != ''){
            addToErrorLogger("addExperiment")
            return response(ERROR_STATUS.NAME_NOT_VALID,{error} );
        }
        if(await this.collectionsService.experiments().get(experimentName)){
            addToErrorLogger("addExperiment")
            return response(ERROR_STATUS.NAME_NOT_VALID,{ error: ERRORS.EXP_EXISTS});
        }
        await this.collectionsService.experiments().add(experimentName,{
            name: experimentName, 
            imageName,
            description: description || ''
        });
        await this.collectionsService.experiments().formsOf(experimentName).add(manuallyFormName,{
            name: manuallyFormName,
            questionIds: [],
            withFixations : true,
            editable : false,
            creation_date: Date.now(),
        });
        return response(0);
    }


    addQuestion = async (experimentName,question, answers, correctAnswer)=>{
        addToRegularLogger("addQuestion", {experimentName,question, answers, correctAnswer})
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            addToErrorLogger("addQuestion")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }
        
        if(correctAnswer >4 || correctAnswer <0){
            addToErrorLogger("addQuestion")
            return response(ERROR_STATUS.GENERAL_ERROR,{error: "the value of the correct answer is not valid"});
        }
        const experimentImageName = experiment.imageName;
        const id = uuidv4();
        await this.collectionsService.images().questionsOf(experimentImageName).add(id, {
            id,
            question: question,
            answers,
            correctAnswer: correctAnswer,
            creation_date: Date.now()
        }); 
        return response(0,{data: {id}});
    }

    mergeSummaries = async(experimentName, mergedName, sammaries_details ) =>{
        addToRegularLogger("mergeSummaries", {experimentName, mergedName, sammaries_details})
        if(sammaries_details.length ==0){
            addToErrorLogger("mergeSummaries")
            return response(ERROR_STATUS.GENERAL_ERROR,{error: "no summaries input provided"});
        }
        var percents = sammaries_details.map(sammary => sammary.percentage)
        var names = sammaries_details.map(sammary => sammary.name)
        var types = sammaries_details.map(sammary => sammary.type);

        const expriment = await this.collectionsService.experiments().get(experimentName)
        if(!expriment){
            addToErrorLogger("mergeSummaries")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        } 
        
       const mergedSummary = await this.collectionsService.experiments().mergedSentOf(experimentName).get(mergedName);
        if(mergedSummary){
            addToErrorLogger("mergeSummaries")
            return response(ERROR_STATUS.NAME_NOT_VALID,{ error: ERRORS.MERGED_SUMMARY_EXISTS});
        }

        const image = await this.collectionsService.images().get(expriment.imageName)
        const base_sent_table = await this.storageService.downloadToBuffer(image.base_sent_table_path);

        const {status, data: sent_tables}  = await this.sent_table_initializer(names,types, expriment);
        if(status !== 0){
            addToErrorLogger("mergeSummaries")
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


    getSentencesWeights = async (experimentName:string) => {
        addToRegularLogger("getSentencesWeights", {experimentName})

        const expriment = await this.collectionsService.experiments().get(experimentName)
        if(!expriment){
            addToErrorLogger("getSentencesWeights")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.EXP_NOT_EXISTS} );
        }

        const img= await this.collectionsService.images().get(expriment.imageName)
        if(!img){
            addToErrorLogger("getSentencesWeights")
            return response(ERROR_STATUS.OBJECT_NOT_EXISTS,{error: ERRORS.IM_NOT_EXISTS} );
        }

        const base_sentences_table = await this.storageService.downloadToBuffer(img.base_sent_table_path);
        return response(0, {data: await csvToJson({delimiter:'auto'}).fromString(base_sentences_table.toString('utf16le'))});   
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
    };
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