const puppeteer = require('puppeteer');
import {fullPageDriver} from '../driver/main.driver';

describe('e2e', () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport:{
                width: 1500,
                height: 1000

            }});
        page = await browser.newPage();     
    })
    beforeEach(async () => {
        await page.goto('http://localhost:3000');
    });
    afterAll(async () => {
        await browser.close();
    })
    it('full page',async () => {
        await page.waitFor(1000);
        await page.screenshot({path: './home.png'});
        const driver = await fullPageDriver(page);

        expect(await driver.exists()).toBe(true);
    })
})
