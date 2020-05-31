import { ExperimentService } from "../services/experimentService";
//@ts-ignore
import { promises as fsPromises } from 'fs';

export const dataCreation = async (experimetService: ExperimentService) => {

    // expA
    console.log('expA: creating...');
    const img = await fsPromises.readFile('./test1.jpg');
    const alg = await fsPromises.readFile('./automatic-algorithms-locally/Alg1.py');
    await experimetService.addAutomaticAlgorithms('algo1.py', alg);
    await experimetService.addImage('img1', img);
    await experimetService.addExperiment('expA', 'img1','img1-desc');
    console.log('expA: Done!');

    // expB (Optional, takes time to create)
    console.log('expB: creating...');
    const img2 = await fsPromises.readFile('./test2.jpg');
    const alg2 = await fsPromises.readFile('./automatic-algorithms-locally/Alg2.py');
    await experimetService.addAutomaticAlgorithms('algo2.py', alg2);
    await experimetService.addImage('img2', img2);
    await experimetService.addExperiment('expB', 'img2','img2-desc');
    console.log('expB: Done!');

    // expC (Optional, takes time to create)
    console.log('expC: creating...');
    const img3 = await fsPromises.readFile('./test1.jpg');
    const alg3 = await fsPromises.readFile('./automatic-algorithms-locally/Alg2.py');
    await experimetService.addAutomaticAlgorithms('algo3.py', alg3);
    await experimetService.addImage('img3', img3);
    await experimetService.addExperiment('expC', 'img3','img3-desc');
    console.log('expC: Done!');

    //QUESTIONS:
    const QA1 = await experimetService.addQuestion(
        "expA",
        "Question number A1?",
        ["Ans number 0", "Ans number 1", "Ans number 2", "Ans number 3"],
        "0"
    );


    const QA2 = await experimetService.addQuestion(
        "expA",
        "Question number A2?",
        ["Ans number 0", "Ans number 1", "Ans number 2", "Ans number 3"],
        "1"
    );

    const QB1 = await experimetService.addQuestion(
        "expB",
        "Question number B1?",
        ["Ans number 0", "Ans number 1", "Ans number 2", "Ans number 3"],
        "2"
    );

    const QC1 = await experimetService.addQuestion(
        "expC",
        "Question number C1?",
        ["Ans number 0", "Ans number 1", "Ans number 2", "Ans number 3"],
        "3"
    );

    // FORM A1 - ALL OPTIONS
    const formA1 = await experimetService.addForm({
        experimentName: 'expA',
        name: 'formA1',
        questionIds: [QA1.data.id, QA2.data.id],
        summary: { "filters": {  "color": { "size": "8", "palete": "op_1" }, "minWeight": "0.1" } },
        isRankSentences: true,
        isReadSummary: true,
        isFillAnswers: true,
        withFixations: true
    });

    // FORM A2 - ONLY QUESTIONS
    const formA2 = await experimetService.addForm({
        experimentName: 'expA',
        name: 'formA2',
        questionIds: [QA1.data.id, QA2.data.id],
        summary: { "filters": { "color": { "size": "8", "palete": "op_1" }, "minWeight": "0.1" } },
        isRankSentences: true,
        isReadSummary: true,
        isFillAnswers: true,
        withFixations: true
    });

    // FORM B1 - ALL OPTIONS
    const formB1 = await experimetService.addForm({
        experimentName: 'expB',
        name: 'formB1',
        questionIds: [QB1.data.id],
        summary: { "filters": { "color": { "size": "8", "palete": "op_1" }, "minWeight": "0.1" } },
        isRankSentences: true,
        isReadSummary: true,
        isFillAnswers: true,
        withFixations: true
    });

    // FORM C1 - ALL OPTIONS
    const formC1 = await experimetService.addForm({
        experimentName: 'expC',
        name: 'formC1',
        questionIds: [QC1.data.id],
        summary: { "filters": { "color": { "size": "8", "palete": "op_1" }, "minWeight": "0.1" } },
        isRankSentences: true,
        isReadSummary: true,
        isFillAnswers: true,
        withFixations: true
    });

    // PLAN1 - Single Form
    const plan1 = await experimetService.addTestPlan(
        'Test Plan1',
        [{ "experimentName": "expA", "formId": "formA1" }]
        // Ask Adir about syntax here - How to use the fields names properly, I couldn't use them here.
    )

    // PLAN2 - TWO forms of TWO different experiments
    const plan2 = await experimetService.addTestPlan(
        'Test Plan2',
        [{ "experimentName": "expA", "formId": "formA1" },
        { "experimentName": "expB", "formId": "formB1" }]
    )

    // PLAN3 - THREE forms of THREE different experiments
    const plan3 = await experimetService.addTestPlan(
        'Test Plan3',
        [{ "experimentName": "expA", "formId": "formA1" },
        { "experimentName": "expB", "formId": "formB1" },
        { "experimentName": "expC", "formId": "formC1" }]
    )

}
