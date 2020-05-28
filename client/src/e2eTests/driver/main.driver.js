

export const DEFAULT_EXP_NAME = "expA";
export const PASSWORD = "1234"

export const enterNewExperimentPage = async (browser) => {
    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue(PASSWORD);

    const submitBtn = await browser.$('#welcome-dialog-new-experiment');
    await submitBtn.click();
}

export const enterExp = async (expIndex, browser) => {
    const chooseExistingBtn = await browser.$('#tabPanel-1');
    await chooseExistingBtn.click();

    await chooseExperiment(expIndex, browser);

    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue('1234');

    const submitBtn = await browser.$('#existing-experiment-submit');
    await submitBtn.click();
}

const chooseExperiment = async (index, browser) => {
    
    const algoDropdown = await browser.$('#choose-from-existing-experiment-select');
    await algoDropdown.click();

    const option = await browser.$(`#choose-from-existing-experiment-select-option-${index}`);
    await option.click();
};

const selectFromDropdownByIndex = async (index,autoCompleteId,browser) => {
    
    const dropdown = await browser.$(`#${autoCompleteId}-input`);
    await dropdown.click();

    const option = await browser.$(`#${autoCompleteId}-option-${index}`);
    await option.click();
};



const fillPasswordAndGo = async (password) => {
    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue(`${password}`);

    const submitBtn = await browser.$('#welcome-dialog-new-experiment');
    await submitBtn.click();
} 


export const answerQuestion = async (browser,ans) => {
    const answer = await browser.$(`#question-ans-${ans}`);
    await answer.click();

    const nextBtn = await browser.$('#question-next');
    await nextBtn.click();
}

export class Driver {
    constructor(browser){
        this.browser = browser;
    }

    click = async (id) => {
        const ele = await this.browser.$(`#${id}`);
        await ele.click();
        return ele;
    };

    setValue = async (id, value) => {
        const ele = await this.browser.$(`#${id}`);
        await ele.setValue(value);
        return ele;
    };

    selectFromDropdownByName = async (name,autoCompleteId) => {
        const input = await this.setValue(autoCompleteId,name)
        await input.click();

        await this.click(`${autoCompleteId}-option-0`);
    };

    expPageDriver = {
        navigateToExperimentPage: async (experimentName) => {
            await this.browser.url('localhost:3000');
            await this.click("tabPanel-1");
    
            await this.selectFromDropdownByName(experimentName,'choose-from-existing-experiment-select');
        
            await this.setValue("welcome-dialog-permission-input",PASSWORD);
        
            await this.click("existing-experiment-submit");
        },
    
    
        navigateTo: {
            summaries: async () => 
                await this.click("main-experiments-summaries"),
            uploadAlg: async () => 
                await this.click("upload-algorithm-side-button"),
            testManager: async () => 
                await this.click("test-form-manager-side-button"),
            testPlan: async () => 
                await this.click("main-experiments-test-plans"),
            testPool: async () => 
                await this.click("main-experiments-test-pool")
        }
    };

    FormChooserDriver = {
        selectForm: async (experimentName,formName) => {
            await this.selectFromDropdownByName(experimentName,'form-chooser-choose-experiment');
            await this.selectFromDropdownByName(formName,'form-chooser-choose-form');
        }
    };

    TestPlanDriver = {
        createTestPlan: async(testPlanName,experimentName,formName) => {
            await this.setValue('create-test-plan-name',testPlanName )
            await this.click('create-test-plan-add-more');
            await this.FormChooserDriver.selectForm(experimentName,formName);
            await this.click('create-test-plan-submit');
        }
    };
    
    UploadAlgDriver = {
        insertName: async (name) => this.setValue('insert-algorithm-name',name),
        upload: async (filePath) => {
            const uploadInput = await this.browser.$(`input[type="file"]`);
            await uploadInput.setValue(filePath);
        },
        submit: async () => this.click("upload-algorithm-button")
    }

    EditFormDriver = {
        clickSwitch: {
            questions: async() => this.click('questions-switch'),
            uploadFixations: async() => this.click('upload-fixations-switch'),
            rankSentences: async() => this.click('rank-sentences-switch'),
        },
        createQuestion: async ({question,answers,ans}) => {

            await this.click('edit-form-add-question-button');

            await this.setValue('add-question-question',question);

            await this.setValue('add-question-ans-0',answers[0]);
            await this.setValue('add-question-ans-1',answers[1]);
            await this.setValue('add-question-ans-2',answers[2]);
            await this.setValue('add-question-ans-3',answers[3]);

            await this.click(`add-question-ans-radio-${ans}`);

            await this.browser.pause(2000);

            await this.click(`add-question-create`);
        }
    };

    SummariesDriver = {
        switchTable: {
            auto: async () => this.click('summaries-auto-switch'),
            eyes: async () => this.click('summaries-eyes-switch'),
            merge: async () => this.click('summaries-merge-switch'),
        },
        nextPage: async () => (await this.browser.$('[aria-label="Next page"]')).click(),
        clickOnRowWithName: async (name) => 
            (await this.browser.$(`[id$="${name}-row"]`)).click(),

        toolbarActions: {
            run: async () => this.click("main-toolbar-run-alg"),
            view: async () => this.click("main-toolbar-view")
        }
        
    }
};