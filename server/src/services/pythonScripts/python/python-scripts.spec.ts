import { PythonScripts } from "./python-scripts";
//@ts-ignore
import {promises as fs} from 'fs';
import { PythonScriptInterface } from "../pythonScriptsTypes";

jest.setTimeout(30000);

describe('pythonScript',() => {
    let pythonService: PythonScriptInterface
    beforeAll(() => {
        pythonService = new PythonScripts();
    })
    it.skip('runAutomaticAlgo',async () => {
        const text = await fs.readFile('./inputForTests/text.txt');
        const base_sent_table = await fs.readFile('./inputForTests/base_sent_table.tsv');
        const res = await pythonService.runAutomaticAlgs(['Alg1.py','Alg2.py'],text,base_sent_table);
        console.log(res);
        expect(true).toBe(true);
    })

    it('imagePreprocess',async () => {
        const image = await fs.readFile('./inputForTests/minTest.jpg');
  
        const res = await pythonService.processImage(image);
        console.log(res);
        expect(true).toBe(true);
    })
})