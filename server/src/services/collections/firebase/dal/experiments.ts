import { Tests } from "./tests";
import { BaseCollection } from "./baseCollection";

export class Experiments extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    getTests(experimentId: string){
        return new Tests(this.collection.doc(experimentId).collection('tests'))
    }
}