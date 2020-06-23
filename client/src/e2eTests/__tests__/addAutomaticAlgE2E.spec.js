const { remote } = require('webdriverio');
import Chance from 'chance';
import { Driver} from '../driver/main.driver';
const chance = new Chance();
import path from 'path';

jest.setTimeout(100000);
describe('Add Automatic Algorithm', () => {
    let browser;
    let driver,experimentDriver;
    beforeAll(async () => {
        browser = await remote({
            logLevel: 'debug',
            capabilities: {
                browserName: 'chrome'
            }
        })
        driver = new Driver(browser);
        experimentDriver = driver.expPageDriver;
    })

    beforeEach(async () => {
        await experimentDriver.navigateToNewExperimentPage();
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    it('success - upload file', async () => {
        const newAlgoName = chance.word();

        await driver.click('upload-algorithm-side-button');
        await driver.setValue('insert-algorithm-name',newAlgoName);
        await browser.pause(1000);

        uploadAlgoAndSubmit();

        await browser.pause(2000);

        const successMessage = await browser.$('#success-alert-upload-algo');
        const isSuccExists = await successMessage.isExisting()

        expect(isSuccExists).toBe(true);
        
    });

    it('fail - name exists', async () => {
        const existsAlgoName = 'algo1';

        await driver.click('upload-algorithm-side-button');
        await driver.setValue('insert-algorithm-name',existsAlgoName);
        await browser.pause(1000);

        uploadAlgoAndSubmit();
        await browser.pause(2000);

        const ErrorText = await browser.$('#insert-algorithm-name-helper-text');
        expect(await ErrorText.getText()).toBe('Name already exsits, please choose different name')

    });

    const uploadAlgoAndSubmit = async () => {
        const filePath = path.join(__dirname, '../../../../server/automatic-algorithms/algo1.py');
        const uploadInput = await browser.$(`input[type="file"]`);
        await uploadInput.setValue(filePath);

        const submitUpload = await browser.$('#upload-algorithm-button');
        await submitUpload.click();
    };

})
