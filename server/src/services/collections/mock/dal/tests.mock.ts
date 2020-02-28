import { Tests } from "../../firebase/dal/tests";

export class TestsMock implements Tests
{
    collection;
    constructor(collection){
        this.collection = collection;
    }
}