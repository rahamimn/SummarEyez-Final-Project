import { Tests } from "./tests";

export class Experiments {
    collection;
    constructor(collection){
        this.collection = collection;
    }
    getTests(experimentId: string){
        return new Tests(this.collection.doc(experimentId).collection('tests'))
    }
}