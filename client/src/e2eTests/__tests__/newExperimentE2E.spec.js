const { remote } = require('webdriverio');
import { Driver} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();
import path from 'path';

jest.setTimeout(100000);
describe('new Experiment', () => {
    let browser;
    let driver,experimentDriver;
    beforeAll(async ()=>{
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

    it('success - from existing image',async () => {
        const newExperimentName = chance.word();

        await driver.setValue('new-experiment-experiment-name',newExperimentName)
        await chooseImage(0);
        await driver.click('new-experiment-submit')

        await browser.pause(5000);

        expect(await browser.getUrl()).toBe(`http://localhost:3000/experiments/${newExperimentName}/info`);
    });

    it('fail - experimentNameExists',async () => {
        const existsingExperimentName = 'exp1'

        await driver.setValue('new-experiment-experiment-name',existsingExperimentName)
        await chooseImage(0);

        await driver.click('new-experiment-submit')

        await browser.pause(1000);
        const helperError = await browser.$('#new-experiment-experiment-name-helper-text');

        expect(await helperError.getText()).toBe(`Name already exsits, please choose different name`);
    });

    it('success - upload new image',async () => {
        const newExperimentName = chance.word();
        const newImageName = chance.word();

        await driver.setValue('new-experiment-experiment-name',newExperimentName)
        await driver.click('new-experiment-upload-image')

        await driver.setValue('upload-image-image-name',newImageName)

        await browser.pause(1000);
        
        uploadImageAndSubmit();

        await browser.pause(80000);

        await driver.click('new-experiment-submit')

        await browser.pause(1000);
        expect(await browser.getUrl()).toBe(`http://localhost:3000/experiments/${newExperimentName}/info`);
    });

    it('fail upload image - name exists',async () => {
        const existsImageName = 'img1';

        await driver.click('new-experiment-upload-image')
        await driver.setValue('upload-image-image-name',existsImageName)
        await browser.pause(1000);
        
        uploadImageAndSubmit();

        const ErrorText = await browser.$('#upload-image-image-name-helper-text');
        expect(await ErrorText.getText()).toBe('name not valid')
    });

    const chooseImage = async (index) => {
        const imageDropdown = await browser.$('#new-experiment-experiment-image');
        await imageDropdown.click();

        const option = await browser.$(`#new-experiment-experiment-image-option-${index}`);
        await option.click();
    };

    const uploadImageAndSubmit = async () => {
        const filePath = path.join(__dirname, '../../../../server/test1.jpg');
        const uploadInput = await browser.$(`input[type="file"]`);
        await uploadInput.setValue(filePath);

        const submitUpload = await browser.$('#upload-image-submit-button');
        await submitUpload.click();
    };
})


