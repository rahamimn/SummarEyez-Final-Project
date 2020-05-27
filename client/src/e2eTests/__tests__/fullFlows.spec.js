
const { remote } = require('webdriverio');
import {answerQuestion, DEFAULT_EXP_NAME, Driver} from '../driver/main.driver';
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



    const createForm = async (newFormName,questions)=>{
        await experimentDriver.navigateTo.testManager();
        await driver.click("create-new-form-btn");
        await driver.setValue("form-name",newFormName);


        await driver.EditFormDriver.clickSwitch.questions();

        await driver.EditFormDriver.createQuestion(questions[0]);
        await driver.EditFormDriver.createQuestion(questions[1]);
        
        await browser.pause(1000);
        
        await driver.click("create-form-submit-btn"); 

        await browser.pause(1000);
    }

    const handleCreateTestPlan = async (newFormName,newTestPlanName)=>{
        await experimentDriver.navigateTo.testPlan();
        await driver.click("test-plan-manaer-create-button");
        await driver.TestPlanDriver.createTestPlan(
            newTestPlanName,
            DEFAULT_EXP_NAME,
            newFormName,
        );

        await browser.pause(1000);
    }

    const performTest = async (studentId,newTestPlanName,questions)=>{
        await browser.url(`localhost:3000/tests/${newTestPlanName}`);
        await driver.setValue('main-tests-student-id', studentId);
        await driver.click('main-tests-register');

        await browser.pause(1000);

        await answerQuestion(browser,questions[0].ans);
        await answerQuestion(browser,questions[1].ans);

        await driver.click('main-tests-submit');

        await browser.pause(1000);
    }

    const viewTestPool = async (questions, newFormName) => {
        await experimentDriver.navigateToExperimentPage(DEFAULT_EXP_NAME);
        experimentDriver.navigateTo.testPool();

        driver.click('main-experiments-test-pool');

        await driver.FormChooserDriver.selectForm(DEFAULT_EXP_NAME, newFormName);

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

        await createForm(newFormName, questions);

        await handleCreateTestPlan(newFormName, newTestPlanName)

        await performTest(studentId, newTestPlanName, questions);

        const [ans0,ans1] = await viewTestPool(questions, newFormName);
        
        expect(ans0).toBe(true);
        expect(ans1).toBe(true);
    });
})
