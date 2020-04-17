import { BaseCollectionMock } from "./baseCollection.mock";


export class QuesionsMock extends BaseCollectionMock {
    collection;
    
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
}