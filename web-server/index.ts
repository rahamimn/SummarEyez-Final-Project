const express = require('express');
const spawn = require("child_process").spawn;

const app = express();

const port = 3000

app.get('/', (req, res) => {


    const pythonProcess = spawn('python3',["./python_script/marker.py", "-i", "test1.jpg"]);
    pythonProcess.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
    pythonProcess.stderr.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))