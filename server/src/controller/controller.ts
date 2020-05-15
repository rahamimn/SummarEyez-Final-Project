import { ExperimentService } from "../services/experimentService";
import { PythonScripts, PythonError } from "../services/pythonScripts/python/python-scripts";
import { Storages } from "../services/storage/storage";
import { Collections } from "../services/collections/collections";
import { dataCreation } from "../utils/dataCreationForE2e";
import { ERROR_STATUS } from "../utils/Errors";

const cors = require('cors');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('output'));
app.use(cors())
// app.use(bodyParser); 
var upload = multer()

const port = process.env.PORT || 4000;
const localMode = process.argv.includes("-local");

const experimentService = new ExperimentService({
    collectionsService: localMode? new Collections.CollectionMock() : new Collections.Firestore(),
    storageService: localMode?  new Storages.MockStorage()  : new Storages.GoogleStorage(),
    pythonService: new PythonScripts()
})



const errorHandling = async (res, cb) => {
    try{
        await cb();

    }catch(error){
        console.log(error);
        
        if(error instanceof PythonError){
            res.send({status: ERROR_STATUS.PYTHON_ERROR, error})
        }
        else{
            res.send({status: ERROR_STATUS.GENERAL_ERROR, error});
        }
    }
}

app.post('/api/images',upload.single('imageBuffer'), (req, res) => errorHandling(res, async () => {
    const response = await experimentService.addImage(req.body.imageName, req.file.buffer);
    res.send(response)
}));

app.get('/api/images', (req, res) => errorHandling(res, async () => {
    const response = await experimentService.getImages();
    res.send(response);
}));

app.get('/api/experiments', (req, res) => errorHandling(res, async () => {
    const response = await experimentService.getExperiments();
    res.send(response);
}));

//returns all the questions of the experiment
app.get('/api/experiments/:experimentName/questions', (req, res) => errorHandling(res, async () => {  
    const response = await experimentService.getAllQuestions(req.params.experimentName)
    res.send(response);
}));

app.get('/api/experiments/:exerimentName/summaries', (req, res) => errorHandling(res, async () => {
    const summaries = await experimentService.getSummaries(req.params.exerimentName);
    res.send(summaries);
}));

app.get('/api/experiments/:exerimentName/summary', (req, res) => errorHandling(res, async () => {
    const asText = req.query.csv;
    const response = await experimentService.getSummary(
        req.params.exerimentName,
        req.query.type,
        req.query.name,
        asText
    );
    if(asText && response.status === 0){
        res.writeHead(200, {
            'Content-Disposition':  'attachment; filename=file1',
            'Content-Type': 'text/csv',
          })
          res.end(response.data)
    }
    else{
        res.send(response);
    }

}));

// not fully implemented 
app.get('/api/experiments/:exerimentId/summary-info', (req, res) => errorHandling(res, async () => {
    // const summaries = await experimentService.getSummaryw(req.params.exerimentId);
    res.send(0);
}));


//should return experiments 
app.get('/api/experiments', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

//create experiment
app.post('/api/experiments', bodyParser.json(), async (req, res) => {  
    const response = await experimentService.addExperiment(req.body.experimentName, req.body.imageName)
    res.send(response);
});

//upload algorithm 
app.post('/api/algorithms',upload.single('algorithmBuffer'), (req, res) => errorHandling(res, async () => {
    const {status, error} = await experimentService.addAutomaticAlgorithms(req.body.algorithmName, req.file.buffer);
    res.send({status: status, error})
}));

app.post('/api/runAutoAlgs', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const {algNames, experimentName} = req.body;
    const {status} = await experimentService.runAutomaticAlgs(algNames, experimentName);
    res.send({status: status})
}));

app.post('/api/experiments/:experimentName/tests', upload.single('fixations'), (req, res) => errorHandling(res, async () => {   
    const jsonData = JSON.parse(req.body.data);
    const params={
        testId: jsonData.testId,
        formId : jsonData.formId || 'Manually',
        answers : jsonData.answers || [],
        score : 0,
        sentanceWeights : jsonData.sentanceWeights || [],
        experimentName: req.params.experimentName,
        fixations: req.file && req.file.buffer,
        testPlanId: jsonData.testPlanId || -1 }
        
    const {status, error} = await experimentService.addTest(params);
    res.send({status: status, error: error})
}));

//the list of algs is the triplet of: algorithm name, type (automatic, test-begaze algo, merged algo), and the percentage of the weight.
//newMergedAlgName is the name of the new merged algorithm
//expirament ID is the name of the expirament
app.post('/api/experiments/:experimentName/summary/merge', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const {name, mergeInputs}  = req.body;
    const summaries = await experimentService.mergeSummaries(experimentName, name, mergeInputs);
    
    res.send(summaries);
}));

app.post('/api/experiments/:experimentName/questions', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const {question, answers, correctAnswer}  = req.body;
    const questionAdded = await experimentService.addQuestion(experimentName,question, answers, correctAnswer);
    res.send(questionAdded);
}));

app.post('/api/testPlan', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const {testPlanName, formsDetails}  = req.body;
    const addTestPlan = await experimentService.addTestPlan(testPlanName, formsDetails);
    res.send(addTestPlan);
}));


app.get('/api/allTestPlan', bodyParser.json(), (req,res) => errorHandling(res, async () => {
    const allTestPlans = await experimentService.getAllTestPlans();
    res.send(allTestPlans);
}));

app.get('/api/testPlan/:testPlanId', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const TestPlan = await experimentService.getTestPlan(req.params.testPlanId);
    res.send(TestPlan);
}));

app.get('/api/experiments/:experimentName/tests',(req, res) => 
 errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const formId= req.query.formId;
    const minScore= req.query.minScore;
    const tests = await experimentService.getFilteredTest(experimentName, formId, minScore);
    res.send(tests)
}));


app.post('/api/experiments/:experimentName/forms', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const params={
        ...req.body,
        experimentName: experimentName,        
    }
    const ans = await experimentService.addForm(params);
    res.send(ans)
}));

app.post('/api/experiments/:experimentName/forms/:formid', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    
    const params={
        experimentName: req.params.experimentName,
        name: req.params.formid,
        questionIds: req.body.questionIds || [],
        summary: req.body.summary || {},
        isRankSentences : req.body.isRankSentences || false,
        isReadSummary : req.body.isReadSummary || false,
        isFillAnswers : req.body.isFillAnswers || false,
        withFixations : req.body.withFixations || false,
    }

    const ans = await experimentService.updateForm(params);
    res.send(ans)
}));


app.get('/api/experiments/:experimentName/forms',(req, res) => 
 errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const forms = await experimentService.getAllForms(experimentName);
    res.send(forms)
}));

app.get('/api/experiments/:experimentName/forms/:formId',(req, res) => 
 errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const formId = req.params.formId;
    const onlyMetaData = req.query.onlyMeta;
    const forms = await experimentService.getForm(experimentName, formId, onlyMetaData);
    res.send(forms)
}));

app.get('/api/testPlans/:testPlanId/tests?csv={true/false}',(req, res) => 
 errorHandling(res, async () => {
    const testId = req.params.testPlanId;
    const csv = req.params.csv;
    const ans = await experimentService.getFullTestPlan(testId, csv);
    res.send(ans)
}));

if(localMode){
    dataCreation(experimentService).then(() => {
        app.listen(port, () => console.log(`Server runs on RAM storage is running on port ${port}!`))
    });
}
else{
    app.listen(port, () => console.log(`Server runs on Google storage is running on port ${port}!`))
}
