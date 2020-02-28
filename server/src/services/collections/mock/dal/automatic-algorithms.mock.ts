import { BaseCollectionMock } from "./baseCollection.mock";

export class AutomaticAlgorithmsMock extends BaseCollectionMock {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    

}