var lexrank = require('lexrank');
const fs = require('fs');
const { ExportToCsv } = require('export-to-csv');

fs.readFile('text.txt', 'utf8', function(err, text) {
  lexrank.summarize(text, Number.MAX_SAFE_INTEGER, function (err, topLines, text) {

    if (err) {
      console.log(err);
    }

    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    
    const csvExporter = new ExportToCsv(options);
    const csvData = csvExporter.generateCsv(topLines, true);
    fs.writeFileSync('Alg3.csv',csvData)
    console.log(topLines);   
  });
});

