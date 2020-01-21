import { ExperimentService } from "../services/experimentService";
import { Firestore } from "../services/collections/firebase/collections-firestore";
import { GoogleStorage } from "../services/storage/googleStorage/googleStorage";
import { PythonScripts } from "../services/pythonScripts/python/python-scripts";

const cors = require('cors');
const express = require('express');
const multer = require('multer');
// const bodyParser = require('body-parser');

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
        res.send({status: -1, err});
    }
}

app.post('/api/images',upload.single('imageBuffer'), (req, res) => errorHandling(res, async () => {
    await experimentService.addImage(req.body.imageName, req.file.buffer);
    res.send({status: 0})
}));

app.get('/api/images', (req, res) => errorHandling(res, async () => {
    const images = await experimentService.getImages();
    res.send(images);
}));

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

// should be called by google, when form submited
// body should include {experimentId}
// save on firebase test{ name, id, answers, score, csvFixationUrl }
app.post('/experiments/:experimentId/tests', (req, res) => { 
    //not implemented
    console.log(req.body);
    res.send({status:7});
});

// save on firebase test{ name, id, answers, score, csvFixationUrl }
app.post('/tests', (req, res) => { 
    //not implemented
    console.log(req.body);
    res.send({status:7});
});

//should add image
//and start job of creating all preprocess files
//if takes long think aboul pulling or dulexer 
// app.post('/images', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

// //should return json image name/url/id
// app.get('/images', (req, res) => {  
//     //not implemented
//     res.send({status:-1});
// });

//should return experiments id/(maybe imageUrl)
app.get('/experiments', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

//create experiment
app.post('/experiments', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

//should return tests id/googleUrl/grade/
app.get('/experiments/:experimentId/tests', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

//should return sentance_table json from sent-table
app.get('/experiments/:experimentId/sent-table/:tableId', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

//should return sentance grades json from word-table
app.get('/experiments/:experimentId/word-table/:tableId', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

/**
 * input: gradeTableIds , and percentages
 * output: id of new gradeTableId
 **/
app.post('/experiments/:experimentId/sent-grades/merge/save', (req, res) => {  
    //not implemented
    res.send({status:-1});
});
/**
 * input: colors-spectrum
 * output: word doc/ or url to watch online
 **/
app.post('/experiments/:experimentId/sent-grades/:tableId/doc', (req, res) => {  
    //not implemented
    res.send({status:-1});
});
/**
 * output: excel or csv file with the grades 
 **/
app.post('/experiments/:experimentId/sent-grades/:tableId/export', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

/*
 * input: gradeTableIds, colors per table
 * output: word doc/ or url to watch online
 */
app.post('/experiments/:experimentId/sent-grades/layers/doc', (req, res) => {  
    //not implemented
    res.send({status:-1});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))