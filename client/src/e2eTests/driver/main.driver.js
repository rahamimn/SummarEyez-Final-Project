

export const enterNewExperimentPage = async (browser) => {
    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue('1234');

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

const selectFromDropdown = async (index,autoCompleteId,browser) => {
    
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


export const createQuestion = async(browser,{question,answers,ans}) => {

    const addQuestionButton = await browser.$('#edit-form-add-question-button');
    await addQuestionButton.click();

    const questionInput = await browser.$('#add-question-question');
    await questionInput.setValue(question);

    let ansInput;
    ansInput = await browser.$('#add-question-ans-0');
    await ansInput.setValue(answers[0]);

    ansInput = await browser.$('#add-question-ans-1');
    await ansInput.setValue(answers[1]);

    ansInput = await browser.$('#add-question-ans-2');
    await ansInput.setValue(answers[2]);

    ansInput = await browser.$('#add-question-ans-3');
    await ansInput.setValue(answers[3]);

    const selectedRadioBtn = await browser.$(`#add-question-ans-radio-${ans}`);
    await selectedRadioBtn.click();

    await browser.pause(2000);

    const submit = await browser.$('#add-question-create');
    await submit.click();
}

export const selectForm = async(browser,{experimentIndex,formName}) => {
    await selectFromDropdown(experimentIndex,'form-chooser-choose-experiment',browser);

    const formInput = await browser.$('#form-chooser-choose-form-input');
    await formInput.setValue(formName);

    await selectFromDropdown(0,'form-chooser-choose-form',browser);
}

export const createTestPlan = async(browser,{testPlanName,experimentIndex,formName}) => {

    const testPlanInput = await browser.$('#create-test-plan-name');
    await testPlanInput.setValue(testPlanName);

    const addMoreBtn = await browser.$('#create-test-plan-add-more');
    await addMoreBtn.click();

    await selectForm(browser,{experimentIndex,formName});
   
    const submitBtn = await browser.$('#create-test-plan-submit');
    await submitBtn.click();
}

export const answerQuestion = async (browser,ans) => {
    const answer = await browser.$(`#question-ans-${ans}`);
    await answer.click();

    const nextBtn = await browser.$('#question-next');
    await nextBtn.click();
}


export const modeClick = async () => {
    const element = await browser.$("#top-nav-mode");
    await element.click();
}