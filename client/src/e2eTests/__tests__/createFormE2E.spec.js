const { remote } = require('webdriverio');
import {enterNewExperimentPage} from '../driver/main.driver';
import Chance from 'chance';
const chance = new Chance();

describe('Manage Form', () => {
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
    });

    afterAll(async () => {
        await browser.deleteSession()
    });

    it('success - upload file',async () => {
       
    });

    it('fail - name exists',async () => {
        //TODO
    });

})
