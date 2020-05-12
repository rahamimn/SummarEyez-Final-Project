const { remote } = require('webdriverio');
import {enterNewExperimentPage} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();
import path from 'path';

jest.setTimeout(100000);
describe('Add Automatic Algorithm', () => {
    let browser;
    beforeAll(async () => {
        browser = await remote({
            logLevel: 'debug',
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

    it('success - upload file', async () => {

        const uploadAlgorithmButton = await browser.$('#upload-algorithm-side-button');
        await uploadAlgorithmButton.click();

        const newAlgoName = chance.word();
        const inputAlgoName = await browser.$('#insert-algorithm-name');
        await inputAlgoName.setValue(newAlgoName);
        await browser.pause(1000);

        uploadAlgoAndSubmit();

        await browser.pause(2000);

        const successMessage = await browser.$('#success-alert-upload-algo');
        const isSuccExists = await successMessage.isExisting()

        expect(isSuccExists).toBe(true);


    });

    it('fail - name exists', async () => {
        //TODO
    });

    const uploadAlgoAndSubmit = async () => {
        const filePath = path.join(__dirname, '../../../../server/automatic-algorithms/algo1.py');
        const uploadInput = await browser.$(`input[type="file"]`);
        await uploadInput.setValue(filePath);

        const submitUpload = await browser.$('#upload-algorithm-button');
        await submitUpload.click();
    };

})
