import { Forms } from "../../firebase/dal/forms";
import { BaseCollectionMock } from "./baseCollection.mock";

export class FormsMock extends BaseCollectionMock implements Forms{ 
    collection;
    constructor(collection){
        super(collection)
        this.collection = collection;
    }
}
