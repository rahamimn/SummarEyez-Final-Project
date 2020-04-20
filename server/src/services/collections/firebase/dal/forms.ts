import { BaseCollection } from "./baseCollection";

export class Forms  extends BaseCollection{
    collection;
    constructor(collection){
        super(collection)
        this.collection = collection;
    }
}


