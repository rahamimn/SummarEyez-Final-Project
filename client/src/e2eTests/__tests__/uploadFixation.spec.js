
const { remote } = require('webdriverio');
import { DEFAULT_EXP_NAME, Driver } from '../driver/main.driver';
import Chance from 'chance';
import path from 'path';
const chance = new Chance();

jest.setTimeout(100000);
describe('Upload Fixations', () => {
    let browser;
    let driver, experimentDriver;
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
        await experimentDriver.navigateToExperimentPage(DEFAULT_EXP_NAME);
    });

    afterAll(async () => {
        await browser.deleteSession()
    });


    it('Success - upload fixation and see results', async () => {
        const newFixationName = chance.word();
        const UploadFixationDriver = driver.UploadFixationDriver;
        const filePath = path.join(__dirname, '../../../../server/inputForTests/fixations.csv');

        await experimentDriver.navigateTo.uploadFixation();

        await UploadFixationDriver.insertName(newFixationName);

        await browser.pause(2000);
        await UploadFixationDriver.upload(filePath);
        await UploadFixationDriver.submit();

        await browser.pause(10000);

        await experimentDriver.navigateTo.summaries();

        const SummariesDriver = driver.SummariesDriver;

        await SummariesDriver.switchTable.eyes();

        for (let i = 0; i < 10; i++) {
            await SummariesDriver.nextPage('eyes');
        }

        await SummariesDriver.clickOnRowWithName(newFixationName);
        await SummariesDriver.toolbarActions.view();

        await browser.pause(1000);

        await browser.url(`http://localhost:3000/article/${DEFAULT_EXP_NAME}/eyes/${newFixationName}`);
        await browser.pause(2000);
    });

    it('Fail - fixation name exists', async () => {
        const myFixationName = chance.word();
        const UploadFixationDriver = driver.UploadFixationDriver;
        const filePath = path.join(__dirname, '../../../../server/inputForTests/fixations.csv');

        await experimentDriver.navigateTo.uploadFixation();

        await UploadFixationDriver.insertName(myFixationName);

        await browser.pause(2000);
        await UploadFixationDriver.upload(filePath);
        await UploadFixationDriver.submit();

        await browser.pause(10000);

        await UploadFixationDriver.insertName(myFixationName);

        await browser.pause(2000);
        await UploadFixationDriver.upload(filePath);
        await UploadFixationDriver.submit();

        const ErrorText = await browser.$('#insert-fixation-name-helper-text');
        expect(await ErrorText.getText()).toBe('Name already exsits, please choose different name')
    });

    it('Fail - bad file format (incorrect fields)', async () => {
        const myFixationName = chance.word();
        const UploadFixationDriver = driver.UploadFixationDriver;
        const filePath = path.join(__dirname, '../../../../server/inputForTests/fixationsBAD.csv');

        await experimentDriver.navigateTo.uploadFixation();

        await UploadFixationDriver.insertName(myFixationName);

        await browser.pause(2000);
        await UploadFixationDriver.upload(filePath);
        await UploadFixationDriver.submit();

        await browser.pause(15000);

        const errorMessage = await browser.$('#error-alert-upload-fixation');
        const isErrorExists = await errorMessage.isExisting()

        expect(isErrorExists).toBe(true);
    });
})
