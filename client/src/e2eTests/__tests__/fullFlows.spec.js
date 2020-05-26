
const { remote } = require('webdriverio');
import {enterExp, createQuestion, createTestPlan} from '../driver/main.driver';
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

    const navigateToCreateForm = async () => {
        const testFormManagerButton = await browser.$('#test-form-manager-side-button');
        await testFormManagerButton.click();

        const createNewFormButton = await browser.$('#create-new-form-btn');
        await createNewFormButton.click();
    }

    const navigateToCreateTestPlan = async () => {
        const testFormManagerButton = await browser.$('#main-experiments-test-plans');
        await testFormManagerButton.click();

        const createNewFormButton = await browser.$('#test-plan-manaer-create-button');
        await createNewFormButton.click();
    }

    const selectQuestion = async (browser,question)=>{
        const selectDropdown = await browser.$('#edit-form-select-questions');
        await selectDropdown.click();

        await browser.pause(5000);
        
        const options = await browser.$$('[id^=edit-form-select-questions-option]');
        console.log(options.length);
    }



    it('success - create form with question conduct test and see results', async () => {

        const newFormName = chance.word();
        const newTestPlanName = chance.word();
      
        const questions = new Array(2).fill(1).map(() => ({
            question: chance.name(),
            answers: [0,1,2,3].map(a => chance.name()),
            ans: chance.integer({min:0,max:3})
        }));
        

        //createForm
        await navigateToCreateForm();

        const formNameBox = await browser.$('#form-name');
        await formNameBox.setValue(newFormName);

        const questionsSwitch = await browser.$('#questions-switch');
        await questionsSwitch.click();    
        await createQuestion(browser,questions[0]);
        await createQuestion(browser,questions[1]);
        
        await browser.pause(1000);
        
        const createFormSubmitBtn = await browser.$('#create-form-submit-btn');
        await createFormSubmitBtn.click();

        await browser.pause(1000);

        //craeteTestPlan
        await navigateToCreateTestPlan();
        await createTestPlan(browser,{
            experimentIndex: 0,
            formName: newFormName,
            testPlanName: newTestPlanName
        });

        await browser.pause(15000);

        //answer test as user



        //see answers in test poll
    });
})
