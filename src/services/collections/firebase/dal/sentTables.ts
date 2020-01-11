import { BaseCollection } from "./baseCollection";

export class SentTable extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
}