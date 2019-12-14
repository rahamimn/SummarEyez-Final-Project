const express = require('express');
const multer = require('multer');

const spawn = require("child_process").spawn;

const app = express();
app.use(express.static('output'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, 'inputImage.jpg')
    }
  })
  
var upload = multer({ storage: storage })


const port = 3000


app.post('/upload',upload.single('inputImage'), (req, res) => {  
    res.send({status:1});
});

app.get('/process', (req, res) => {

    const pythonProcess = spawn('python3',["./python_script/marker.py", "-i", "./uploads/inputImage.jpg"]);
    
    pythonProcess.stdout.on('data', function(data) {
        console.log(data.toString());
        res.sendFile('output/docWords.docx',{ root: __dirname });
    });
    pythonProcess.stderr.on('data', function(data) {
        console.log(data.toString());
        res.write(data);

        res.end('end');
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))