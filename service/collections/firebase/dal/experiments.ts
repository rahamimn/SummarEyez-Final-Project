import { Tests } from "./tests";

export class experiment {
    collection;
    constructor(collection){
        this.collection = collection;
    }
    getTests(experimentId: string){
        return new Tests(this.collection.doc(experimentId).collection('tests'))
    }
}