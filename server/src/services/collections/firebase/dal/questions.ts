import { BaseCollection } from "./baseCollection";

export class Questions extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
}