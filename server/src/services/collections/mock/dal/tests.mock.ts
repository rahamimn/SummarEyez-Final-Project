import { Tests } from "../../firebase/dal/tests";
import { BaseCollectionMock } from "./baseCollection.mock";

export class TestsMock extends BaseCollectionMock implements Tests{
    collection;
    constructor(collection){
        super(collection)
        this.collection = collection;
    }
}