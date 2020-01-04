const {PythonShell} = require('python-shell');
const fs = require('fs');

let pyshell = new PythonShell('./sendingFile.py', {mode: 'binary'});
pyshell.stdout.on('data', function (buffer) {
    fs.writeFile('writeByNode.txt', buffer, (e) => {
        console.log(buffer);
        console.log(e)
    })
});