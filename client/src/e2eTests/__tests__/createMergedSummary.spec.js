
const { remote } = require('webdriverio');
import { DEFAULT_EXP_NAME, Driver} from '../driver/main.driver';
import Chance from 'chance';
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

    const addMergedSummary = async (name, isMergedSectionAlreadyOpen) => {
        const val0 = chance.integer({min:0, max:100});

        const SummariesDriver = driver.SummariesDriver;

        await experimentDriver.navigateTo.summaries();
  
        if(!isMergedSectionAlreadyOpen)
            { await SummariesDriver.switchTable.auto(); }

        await SummariesDriver.clickOnRowWithName('algo1.py');
        await SummariesDriver.clickOnRowWithName('algo1b.py');
        await SummariesDriver.toolbarActions.merge();

        await driver.setValue('slider-num-0',val0)
        await driver.setValue('slider-num-1',100-val0)

        await driver.setValue('submit-merged-summary-name-input',name)
        await driver.click('create-merged-summary-btn');
        await browser.pause(1000);
    };

    it('success - create merged summary and see results', async () => {
        const newSummaryName = chance.word();
        const SummariesDriver = driver.SummariesDriver;

        await addMergedSummary(newSummaryName, false);
        await browser.pause(4000);
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

    it('fail - name exists', async () => {
        const aSummaryName = chance.word();

        await addMergedSummary(aSummaryName, false);
        await browser.pause(4000);
        await addMergedSummary(aSummaryName, true);

        const ErrorText = await browser.$('#submit-merged-summary-name-input-helper-text');
        expect(await ErrorText.getText()).toBe('invalid name')
    });
})
