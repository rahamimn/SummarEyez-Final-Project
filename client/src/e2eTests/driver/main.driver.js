

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

const fillPasswordAndGo = async (password) => {
    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue(`${password}`);

    const submitBtn = await browser.$('#welcome-dialog-new-experiment');
    await submitBtn.click();
} 