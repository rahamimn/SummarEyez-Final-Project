import { ExperimentService } from "../services/experimentService";
//@ts-ignore
import {promises as fsPromises} from 'fs';

export const dataCreation = async (experimetService: ExperimentService) => {
    const img = await fsPromises.readFile('./test1.jpg');
    const alg = await fsPromises.readFile('./automatic-algorithms-locally/Alg1.py');    
    
    await experimetService.addAutomaticAlgorithms('algo1.py',alg);
    await experimetService.addImage('img1',img);
    await experimetService.addExperiment('exp1','img1');
}
