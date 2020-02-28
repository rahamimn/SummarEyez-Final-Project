import { TestsMock } from "./tests.mock";
import { BaseCollectionMock } from "./baseCollection.mock";
import { Experiments } from "../../firebase/dal/experiments";

export class ExperimentsMock extends BaseCollectionMock implements Experiments {
    collection;
    
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    getTests(experimentId: string){
        return this.getSubCollectionOf(experimentId,'tests',TestsMock);
    }
}