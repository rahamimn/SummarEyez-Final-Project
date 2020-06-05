
const { remote } = require('webdriverio');
import { answerQuestion, DEFAULT_EXP_NAME, Driver } from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();

jest.setTimeout(100000);
describe('Add Custom Summary', () => {
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

    it('success - create custom summary and see results', async () => {

        await experimentDriver.navigateTo.addCustomSummary();

        const newSummaryName = chance.word();
        const inputSummaryName = await browser.$('#add-custom-summary-name-input');
        await inputSummaryName.setValue(newSummaryName);

        const sentence1 = await browser.$('//body/div/div/div/div/main/div[2]/div[2]/div[2]/div/p[1]/span/span');
        await sentence1.click()
        await setWeightValue(browser);

        const sentence2 = await browser.$(`//body/div/div/div/div/main/div[2]/div[2]/div[2]/div/p[2]/span[${chance.integer({ min: 1, max: 9 })}]/span`);
        await sentence2.click()
        await setWeightValue(browser);

        const sentence3 = await browser.$(`//body/div/div/div/div/main/div[2]/div[2]/div[2]/div/p[3]/span[${chance.integer({ min: 1, max: 7 })}]/span`);
        await sentence3.click()
        await setWeightValue(browser);

        const sentence4 = await browser.$(`//body/div/div/div/div/main/div[2]/div[2]/div[2]/div/p[4]/span[${chance.integer({ min: 1, max: 4 })}]/span`);
        await sentence4.click()
        await setWeightValue(browser);

        await browser.pause(1000);

        const addButton = await browser.$('#add-custom-summary-submit');
        await addButton.click()

        await browser.pause(1000);

        await experimentDriver.navigateTo.summaries();

        const SummariesDriver = driver.SummariesDriver;

        await SummariesDriver.switchTable.custom();

        for (let i = 0; i < 10; i++) {
            await SummariesDriver.nextPage('custom');
        }

        await SummariesDriver.clickOnRowWithName(newSummaryName);
        await SummariesDriver.toolbarActions.view();

        await browser.pause(1000);

        await browser.url(`http://localhost:3000/article/${DEFAULT_EXP_NAME}/custom/${newSummaryName}`);
        await browser.pause(2000);
    });

    it('fail - name exists', async () => {

        await experimentDriver.navigateTo.addCustomSummary();

        const mySummaryName = chance.word();
        const inputSummaryName = await browser.$('#submit-merged-summary-name-input');
        await inputSummaryName.setValue(mySummaryName);

        const addButton = await browser.$('#add-custom-summary-submit');
        await addButton.click()

        await browser.pause(1000);

        await experimentDriver.navigateTo.addCustomSummary();

        const inputSummaryName2 = await browser.$('#add-custom-summary-name-input');
        await inputSummaryName2.setValue(mySummaryName);

        await browser.pause(1000);

        const addButton2 = await browser.$('#add-custom-summary-submit');
        await addButton2.click()

        await browser.pause(1000);

        const ErrorText = await browser.$('#add-custom-summary-name-input-helper-text');
        expect(await ErrorText.getText()).toBe('name error, already exists or wrong characters')

    });
})

async function setWeightValue(browser) {
    const minWeightBox = await browser.$('#minimumWeight');
    await minWeightBox.setValue(chance.floating({ min: 0.1, max: 0.9, fixed: 1 }));
    const okButton = await browser.$('#ok-minimum-weight');
    await okButton.click();
}

