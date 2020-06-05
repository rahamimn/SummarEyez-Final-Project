
const { remote } = require('webdriverio');
import {answerQuestion, DEFAULT_EXP_NAME, Driver} from '../driver/main.driver';
import Chance from 'chance';
import path from 'path';
const chance = new Chance();

jest.setTimeout(100000);
describe('Create Merged Summary', () => {
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



    it('success - create merged summary and see results', async () => {

        await experimentDriver.navigateTo.summaries();

        const SummariesDriver = driver.SummariesDriver;

        await SummariesDriver.switchTable.auto();

        await SummariesDriver.clickOnRowWithName('algo1.py');
        await SummariesDriver.clickOnRowWithName('algo1b.py');
        await SummariesDriver.toolbarActions.merge();

        const val0 = chance.integer({min:0, max:100});
        const box0 = await browser.$('#slider-num-0');
        await box0.setValue(val0);

        const box1 = await browser.$('#slider-num-1');
        await box1.setValue(100-val0);

        const newSummaryName = chance.word();
        const inputSummaryName = await browser.$('#submit-merged-summary-name-input');
        await inputSummaryName.setValue(newSummaryName);

        const createButton = await browser.$('#create-merged-summary-btn');
        await createButton.click()

        await browser.pause(10000);

        await SummariesDriver.switchTable.merge();

        for(let i = 0; i < 10; i++){ 
            await SummariesDriver.nextPage('merged');
        }

        await SummariesDriver.clickOnRowWithName(newSummaryName);
        await SummariesDriver.toolbarActions.view();

        await browser.pause(1000);

        await browser.url(`http://localhost:3000/article/${DEFAULT_EXP_NAME}/merged/${newSummaryName}`);
        await browser.pause(2000);
    });

    // it('fail - name exists', async () => {

    //     await experimentDriver.navigateTo.summaries();

    //     const SummariesDriver = driver.SummariesDriver;

    //     await SummariesDriver.switchTable.auto();

    //     await SummariesDriver.clickOnRowWithName('algo1.py');
    //     await SummariesDriver.clickOnRowWithName('algo1b.py');
    //     await SummariesDriver.toolbarActions.merge();

    //     const box0 = await browser.$('#slider-num-0');
    //     await box0.setValue(100);

    //     const box1 = await browser.$('#slider-num-1');
    //     await box1.setValue(0);

    //     const mySummaryName = chance.word();
    //     const inputSummaryName = await browser.$('#submit-merged-summary-name-input');
    //     await inputSummaryName.setValue(mySummaryName);

    //     const createButton = await browser.$('#create-merged-summary-btn');
    //     await createButton.click()

    //     await browser.pause(10000);

    //     await SummariesDriver.toolbarActions.merge();

    //     const box0 = await browser.$('#slider-num-0');
    //     await box0.setValue(100);

    //     const box1 = await browser.$('#slider-num-1');
    //     await box1.setValue(0);

    //     const inputSummaryName2 = await browser.$('#submit-merged-summary-name-input');
    //     await inputSummaryName2.setValue(mySummaryName);

    //     const createButton = await browser.$('#create-merged-summary-btn');
    //     await createButton.click()

    //     //catch error 
    // });
})
