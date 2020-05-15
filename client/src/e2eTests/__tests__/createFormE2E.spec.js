
const { remote } = require('webdriverio');
import {enterExp} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();

jest.setTimeout(100000);
describe('Manage Form', () => {
    let browser;
    beforeAll(async ()=>{
        browser = await remote({
            logLevel: 'debug',
            capabilities: {
                browserName: 'chrome'
            }
        })

    })

    beforeEach(async () => {
        await browser.url('localhost:3000')
        await enterExp(0,browser);
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    it('success - create new form',async () => {
        
        const testFormManagerButton = await browser.$('#test-form-manager-side-button');
        await testFormManagerButton.click();

        const createNewFormButton = await browser.$('#create-new-form-btn');
        await createNewFormButton.click();

        const newFormName = chance.word();
        const formNameBox = await browser.$('#form-name');
        await formNameBox.setValue(newFormName);

        const uploadFixationButton = await browser.$('#upload-fixations-switch');
        await uploadFixationButton.click();

        const rankSentencesButton = await browser.$('#rank-sentences-switch');
        await rankSentencesButton.click();

        const createFormSubmitBtn = await browser.$('#create-form-submit-btn');
        await createFormSubmitBtn.click();
        
        await browser.pause(1000);

    });

    it('fail - form name exists',async () => {
        const testFormManagerButton = await browser.$('#test-form-manager-side-button');
        await testFormManagerButton.click();

        const createNewFormButton = await browser.$('#create-new-form-btn');
        await createNewFormButton.click();

        const existingFormName = 'formA1';
        const formNameBox = await browser.$('#form-name');
        await formNameBox.setValue(existingFormName);

        const uploadFixationButton = await browser.$('#upload-fixations-switch');
        await uploadFixationButton.click();

        const rankSentencesButton = await browser.$('#rank-sentences-switch');
        await rankSentencesButton.click();

        const createFormSubmitBtn = await browser.$('#create-form-submit-btn');
        await createFormSubmitBtn.click();

        const ErrorText = await browser.$('#form-name-helper-text');
        expect(await ErrorText.getText()).toBe('Name empty, or already exsits')
    });

})
