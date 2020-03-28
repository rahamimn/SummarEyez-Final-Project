import { ExperimentService } from "../services/experimentService";
import { Firestore } from "../services/collections/firebase/collections-firestore";
import { GoogleStorage } from "../services/storage/googleStorage/googleStorage";
import { PythonScripts } from "../services/pythonScripts/python/python-scripts";

const cors = require('cors');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('output'));
app.use(cors())
// app.use(bodyParser); 
var upload = multer()

const port = process.env.PORT || 4000

const experimentService = new ExperimentService({
    collectionsService: new Firestore(),
    storageService: new GoogleStorage(),
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//upload algorithm 
app.post('/api/algorithms',upload.single('algorithmBuffer'), (req, res) => errorHandling(res, async () => {
    const {status, error} = await experimentService.addAutomaticAlgorithms(req.body.algorithmName, req.file.buffer);
    res.send({status: status, error})
}));

app.post('/api/runAutoAlgs', bodyParser.json(), (req, res) => errorHandling(res, async () => {
    const {algNames, experimentName} = req.body;
    console.log(algNames, experimentName);
    const {status} = await experimentService.runAutomaticAlgs(algNames, experimentName);
    res.send({status: status})
}));

//todo: handle the get if needed
// app.get('/api/algorithms', (req, res) => errorHandling(res, async () => {
//     const algorithms = await experimentService.get();
//     res.send(algorithms);
// }));
//upload algorithms until here








// app.get('/process', (req, res) => {
//     let errStr = '';
//     const pythonProcess = spawn('python3',["./python_script/marker.py", "-i", "./uploads/inputImage.jpg"]);
//     pythonProcess.on('exit', (code) => {
//         console.log(`child process exited with code ${code}`);
//         if(code === 0){
//                 res.sendFile('output/docWords.docx',{ root: __dirname });
//         }
//         else{
//             res.end(errStr);
//         }
  
//     })
//     pythonProcess.stdout.on('data', function(data) {
//         errStr += data.toString()
//     });
//     pythonProcess.stderr.on('data', function(data) {
//         errStr += data.toString()
//     });
// })

// should be called by google, when form submited
// body should include {experimentId}
// save on firebase test{ name, id, answers, score, csvFixationUrl }
// app.post('/tests', (req, res) => { 
//     //not implemented
//     console.log(req.body);
//     res.send({status:7});
// });

//real api



// //should return tests id/googleUrl/grade/
// app.get('/experiments/:experimentId/tests', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

// //should return sentance_table json from sent-table
// app.get('/experiments/:experimentId/sent-table/:tableId', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

// //should return sentance grades json from word-table
// app.get('/experiments/:experimentId/word-table/:tableId', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

// /**
//  * input: gradeTableIds , and percentages
//  * output: id of new gradeTableId
//  **/
// app.post('/experiments/:experimentId/sent-grades/merge/save', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });
// /**
//  * input: colors-spectrum
//  * output: word doc/ or url to watch online
//  **/
// app.post('/experiments/:experimentId/sent-grades/:tableId/doc', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });
// /**
//  * output: excel or csv file with the grades 
//  **/
// app.post('/experiments/:experimentId/sent-grades/:tableId/export', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

// /*
//  * input: gradeTableIds, colors per table
//  * output: word doc/ or url to watch online
//  */
// app.post('/experiments/:experimentId/sent-grades/layers/doc', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });
