const { remote } = require('webdriverio');
import {enterNewExperimentPage} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();

describe('new Experiment', () => {
    let browser;
    beforeAll(async ()=>{
        browser = await remote({
            logLevel: 'trace',
            capabilities: {
                browserName: 'chrome'
            }
        })

    })

    beforeEach(async () => {
        await browser.url('localhost:3000')
        await enterNewExperimentPage(browser);
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    it('success - from existing image',async () => {
        const newExperimentName = chance.word();

        const inputElem = await browser.$('#new-experiment-experiment-name');
        await inputElem.setValue(newExperimentName);

        const submitBtn = await browser.$('#new-experiment-experiment-image');
        await submitBtn.click();
        const option0 = await browser.$('#new-experiment-experiment-image-option-0');
        await option0.click();
        const submit = await browser.$('#new-experiment-submit');
        await submit.click();

        // await browser.pause(5000);

        expect(await browser.getUrl()).toBe(`http://localhost:3000/experiments/${newExperimentName}/summaries`);
    });

    it('success - upload new image',async () => {
        //TODO
    });

    it('fail upload image - name exists',async () => {
        //TODO
    });

})
