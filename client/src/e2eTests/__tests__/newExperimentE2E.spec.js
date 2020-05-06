const { remote } = require('webdriverio');
import {enterNewExperimentPage} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();
import path from 'path';

jest.setTimeout(100000);
describe('new Experiment', () => {
    let browser;
    beforeAll(async ()=>{
        browser = await remote({
            logLevel: 'trace',
            capabilities: {
                browserName: 'chrome'
            }
        })

    })

    beforeEach(async () => {
        await browser.url('localhost:3000')
        await enterNewExperimentPage(browser);
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    it('success - from existing image',async () => {
        const newExperimentName = chance.word();

        const inputElem = await browser.$('#new-experiment-experiment-name');
        await inputElem.setValue(newExperimentName);

        const imageDropdown = await browser.$('#new-experiment-experiment-image');
        await imageDropdown.click();
        const option0 = await browser.$('#new-experiment-experiment-image-option-0');
        await option0.click();
        const submit = await browser.$('#new-experiment-submit');
        await submit.click();

        // await browser.pause(5000);

        expect(await browser.getUrl()).toBe(`http://localhost:3000/experiments/${newExperimentName}/summaries`);
    });

    it('success - upload new image',async () => {
        const newExperimentName = chance.word();
        const newImageName = chance.word();

        const filePath = path.join(__dirname, '../../../../server/test1.jpg');

        const inputElem = await browser.$('#new-experiment-experiment-name');
        await inputElem.setValue(newExperimentName);

        const toggleImageUploader = await browser.$('#new-experiment-upload-image');
        await toggleImageUploader.click();

        const inputImageName = await browser.$('#upload-image-image-name');
        await inputImageName.setValue(newImageName);
        await browser.pause(1000);
        
        const uploadInput = await browser.$(`input[type="file"]`);
        await uploadInput.setValue(filePath);
        const submitUpload = await browser.$('#upload-image-submit-button');
        await submitUpload.click();

        await browser.pause(10000);

        const submit = await browser.$('#new-experiment-submit');
        await submit.click();

        await browser.pause(1000);
        expect(await browser.getUrl()).toBe(`http://localhost:3000/experiments/${newExperimentName}/summaries`);
    });

    it('fail upload image - name exists',async () => {
        //TODO
    });

})
