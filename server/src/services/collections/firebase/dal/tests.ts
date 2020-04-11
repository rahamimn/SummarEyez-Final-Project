import { BaseCollection } from "./baseCollection";

export class Tests extends BaseCollection{
    collection;
    constructor(collection){
        super(collection)
        this.collection = collection;
    }
}