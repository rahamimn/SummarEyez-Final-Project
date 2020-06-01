import { TestsMock } from "./tests.mock";
import { BaseCollectionMock } from "./baseCollection.mock";
import { Experiments } from "../../firebase/dal/experiments";
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
        return this.getSubCollectionOf(experimentId, 'merged-sent', BaseCollectionMock)
    }

    mergedWordOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'merged-word', BaseCollectionMock)
    }
    formsOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'forms', FormsMock)
    } 
    customSummariesOf(experimentId: string){
        return this.getSubCollectionOf(experimentId, 'custom-summaries', BaseCollectionMock)
    } 
}