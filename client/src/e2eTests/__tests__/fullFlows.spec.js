
const { remote } = require('webdriverio');
import {enterExp, createQuestion, createTestPlan, answerQuestion, selectForm} from '../driver/main.driver';
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

    const createForm = async (newFormName,questions)=>{
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
    }

    const handleCreateTestPlan = async (newFormName,newTestPlanName)=>{
        await navigateToCreateTestPlan();
        await createTestPlan(browser,{
            experimentIndex: 0,
            formName: newFormName,
            testPlanName: newTestPlanName
        });

        await browser.pause(1000);
    }

    const performTest = async (studentId,newTestPlanName,questions)=>{
        await browser.url(`localhost:3000/tests/${newTestPlanName}`);
        const studentIdInput = await browser.$('#main-tests-student-id');
        await studentIdInput.setValue(studentId);

        const registerTest = await browser.$('#main-tests-register');
        await registerTest.click();

        await browser.pause(1000);

        await answerQuestion(browser,questions[0].ans);
        await answerQuestion(browser,questions[1].ans);

        const submitTest = await browser.$('#main-tests-submit');
        await submitTest.click();

        await browser.pause(1000);
    }

    const viewTests = async (questions, newFormName) => {
        await browser.url('localhost:3000')
        await enterExp(0,browser);

        const testPoolBtn = await browser.$('#main-experiments-test-pool');
        await testPoolBtn.click();

        await selectForm(browser,{experimentIndex:0, formName: newFormName});

        await browser.pause(1000);

        const answerCell0 = await browser.$('#cell-answers0-0');
        const answerCell1 = await browser.$('#cell-answers1-0');
        const ansOf0 = (await answerCell0.getText()).startsWith(questions[0].ans);
        const ansOf1 = (await answerCell1.getText()).startsWith(questions[1].ans);

        return [ansOf0, ansOf1];
    }


    it('success - create form with question conduct test and see results', async () => {

        const newFormName = chance.word();
        const newTestPlanName = chance.word();
        const studentId = chance.word();
      
        const questions = new Array(2).fill(1).map(() => ({
            question: chance.name(),
            answers: [0,1,2,3].map(a => chance.name()),
            ans: chance.integer({min:0,max:3})
        }));

        //createForm
        await createForm(newFormName, questions);

        //craeteTestPlan
        await handleCreateTestPlan(newFormName, newTestPlanName)

        //answer test as user
        await performTest(studentId, newTestPlanName, questions);

        //see answers in test poll
        const [ans0,ans1] = await viewTests(questions, newFormName);
        
        expect(ans0).toBe(true);
        expect(ans1).toBe(true);
    });
})
