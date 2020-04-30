import { BaseCollection } from "./baseCollection";

export class TestPlans extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }

}