import { BaseCollectionMock } from "./baseCollection.mock";
import { SentTable } from "../../firebase/dal/sentTables";

export class SentTableMock extends BaseCollectionMock implements SentTable {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
}