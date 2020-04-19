import { TestsMock } from "./tests.mock";
import { BaseCollectionMock } from "./baseCollection.mock";
import { Experiments } from "../../firebase/dal/experiments";
import { SentTableMock } from './sentTables.mock';
import { FormsMock } from './forms.mock';

export class ExperimentsMock extends BaseCollectionMock implements Experiments {
    collection;
    
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    getTests(experimentId: string){
        return this.getSubCollectionOf(experimentId,'tests',TestsMock);
    }
    mergedSentOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'merged-sent', SentTableMock)
    }

    mergedWordOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'merged-word', SentTableMock)
    }
    FormsOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'forms', FormsMock)
        
    } 
}