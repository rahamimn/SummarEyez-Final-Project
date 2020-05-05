

export const enterNewExperimentPage = async (browser) => {
    const inputElem = await browser.$('#welcome-dialog-permission-input');
    await inputElem.setValue('1234');

    const submitBtn = await browser.$('#welcome-dialog-new-experiment');
    await submitBtn.click();
}