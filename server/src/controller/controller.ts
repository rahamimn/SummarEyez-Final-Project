import { ExperimentService } from "../services/experimentService";
import { PythonScripts } from "../services/pythonScripts/python/python-scripts";
import { Storages } from "../services/storage/storage";
import { Collections } from "../services/collections/collections";
import { dataCreation } from "../utils/dataCreationForE2e";

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

    }catch(err){
        console.log(err);
        res.send({status: -1, err});
    }
}

app.post('/api/images',upload.single('imageBuffer'), (req, res) => errorHandling(res, async () => {
    await experimentService.addImage(req.body.imageName, req.file.buffer);
    res.send({status: 0})
}));

app.get('/api/images', (req, res) => errorHandling(res, async () => {
    const response = await experimentService.getImages();
    res.send(response);
}));

app.get('/api/experiments', (req, res) => errorHandling(res, async () => {
    const response = await experimentService.getExperiments();
    res.send(response);
}));

// not fully implemented 
app.get('/api/experiments/:exerimentName/summaries', (req, res) => errorHandling(res, async () => {
    const summaries = await experimentService.getSummaries(req.params.exerimentName);
    res.send(summaries);
}));

// not fully implemented 
app.get('/api/experiments/:exerimentName/summary', (req, res) => errorHandling(res, async () => {
    const summary = await experimentService.getSummary(
        req.params.exerimentName,
        req.query.type,
        req.query.name
    );
    res.send(summary);
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
    const jsonData = JSON.parse(req.query.data);
    console.log(jsonData);
    const params={
        testId: jsonData.testId,
        formId : jsonData.formId || 'Manually',
        answers : jsonData.answers || [],
        score : jsonData.score || 0,
        sentanceWeights : jsonData.sentanceWeights || [],
        experimentName: req.params.experimentName,
        fixations: req.file.buffer }
        
    const {status, error} = await experimentService.addTest(params);
    res.send({status: status, error: error})
}));

//the list of algs is the triplet of: algorithm name, type (automatic, test-begaze algo, merged algo), and the percentage of the weight.
//newMergedAlgName is the name of the new merged algorithm
//expirament ID is the name of the expirament
app.post('/api/experiments/:experimentName/summary/merge', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const {name, mergeInputs}  = req.body;
    const summaries = await experimentService.merge_algorithms(experimentName, name, mergeInputs);
    
    res.send(summaries);
}));

app.post('/api/experiments/:experimentName/questions', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const experimentName = req.params.experimentName;
    const {question, answers, correctAnswer}  = req.body;
    const questionAdded = await experimentService.addQuestion(experimentName,question, answers, correctAnswer);
    
    res.send(questionAdded);
}));

if(localMode){
    dataCreation(experimentService).then(() => {
        app.listen(port, () => console.log(`Server runs on RAM storage is running on port ${port}!`))
    });
}
else{
    app.listen(port, () => console.log(`Server runs on Google storage is running on port ${port}!`))
}
