
const { remote } = require('webdriverio');
import {answerQuestion, DEFAULT_EXP_NAME, Driver} from '../driver/main.driver';
import Chance from 'chance';
import path from 'path';
const chance = new Chance();

jest.setTimeout(100000);
describe('View Layers', () => {
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

    
    it('success - choose 2 summaries, combine and view layers', async () => {

        await experimentDriver.navigateTo.summaries();

        const SummariesDriver = driver.SummariesDriver;

        await SummariesDriver.switchTable.auto();

        await SummariesDriver.clickOnRowWithName('algo1.py');
        await SummariesDriver.clickOnRowWithName('algo1b.py');
        await SummariesDriver.toolbarActions.layers();

        await browser.pause(1000);

        await browser.url(`http://localhost:3000/article-layers/expA?summaries%5B0%5D%5Bname%5D=algo1.py&summaries%5B0%5D%5Btype%5D=auto&summaries%5B1%5D%5Bname%5D=algo1b.py&summaries%5B1%5D%5Btype%5D=auto`);
        await browser.pause(2000);
    });

})
