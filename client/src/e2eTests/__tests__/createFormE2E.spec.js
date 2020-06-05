
const { remote } = require('webdriverio');
import {Driver, DEFAULT_EXP_NAME} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();

jest.setTimeout(100000);
describe('Manage Form', () => {
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
        await experimentDriver.navigateToExperimentPage(DEFAULT_EXP_NAME);
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    const createForm = async (name) => {
        const testFormManagerButton = await browser.$('#test-form-manager-side-button');
        await testFormManagerButton.click();

        const createNewFormButton = await browser.$('#create-new-form-btn');
        await createNewFormButton.click();

        await driver.setValue('form-name',name);

        await driver.EditFormDriver.clickSwitch.questions();
        await driver.EditFormDriver.clickSwitch.readSummary();
        await driver.EditFormDriver.clickSwitch.rankSentences();
        await driver.EditFormDriver.clickSwitch.uploadFixations();

        await browser.pause(1000);

        await driver.click('create-form-submit-btn');
        
        await browser.pause(1000);
    };

    it('success - create new form',async () => {
        const newFormName = chance.word();

        await createForm(newFormName);

        await driver.click('forms-manager-choose-form');

        const options = await browser.$$(`[id^=forms-manager-choose-form-option-]`);
    
        const exists = options.some(async op => await op.getText() === newFormName)
        expect(exists).toBe(true)
    });

    it('fail - form name exists',async () => {
        const existingFormName = 'formA1';

        await createForm(existingFormName);
      
        const ErrorText = await browser.$('#form-name-helper-text');
        expect(await ErrorText.getText()).toBe('Name empty, or already exsits')
    });
})
