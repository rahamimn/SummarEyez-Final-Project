import { ExperimentService } from "../services/experimentService";
//@ts-ignore
import { promises as fsPromises } from 'fs';

export const dataCreation = async (experimetService: ExperimentService) => {

    // EXP1
    console.log('Starting: Create Exp1');
    const img = await fsPromises.readFile('./test1.jpg');
    const alg = await fsPromises.readFile('./automatic-algorithms-locally/Alg1.py');
    await experimetService.addAutomaticAlgorithms('algo1.py', alg);
    await experimetService.addImage('img1', img);
    await experimetService.addExperiment('exp1', 'img1');
    console.log('Done: Create Exp1');

    // EXP2 (Optional, takes time to create)
    console.log('Starting: Create Exp2');
    const img2 = await fsPromises.readFile('./test2.jpg');
    const alg2 = await fsPromises.readFile('./automatic-algorithms-locally/Alg2.py');
    await experimetService.addAutomaticAlgorithms('algo2.py', alg2);
    await experimetService.addImage('img2', img2);
    await experimetService.addExperiment('exp2', 'img2');
    console.log('Done: Create Exp2');

    // EXP3 (Optional, takes time to create)
    console.log('Starting: Create Exp3');
    const img3 = await fsPromises.readFile('./test1.jpg');
    const alg3 = await fsPromises.readFile('./automatic-algorithms-locally/Alg2.py');
    await experimetService.addAutomaticAlgorithms('algo3.py', alg3);
    await experimetService.addImage('img3', img3);
    await experimetService.addExperiment('exp3', 'img3');
    console.log('Done: Create Exp3');

    //QUESTIONS:
    const exp1_Q1 = await experimetService.addQuestion(
        "exp1",
        "Q1?",
        ["a1", "a2", "a3", "a4"],
        "0"
    );


    const exp1_Q2 = await experimetService.addQuestion(
        "exp1",
        "Q2?",
        ["b1", "b2", "b3", "b4"],
        "1"
    );

    // FORM1 - ALL OPTIONS
    const form1 = await experimetService.addForm({
        experimentName: 'exp1',
        name: 'form1_all-optionz',
        questionIds: [exp1_Q1.data.id, exp1_Q2.data.id],
        summary: { "filters": { "isGradient": true, "color": { "size": "8", "palete": "op_1" }, "minWeight": "0.1" } },
        isRankSentences: true,
        isReadSummary: true,
        isFillAnswers: true,
        withFixations: true
    });
}
