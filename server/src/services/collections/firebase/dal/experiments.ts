import { Tests } from "./tests";
import { BaseCollection } from "./baseCollection";
import { Forms } from "./forms";

export class Experiments extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    getTests(experimentId: string){
        return new Tests(this.collection.doc(experimentId).collection('tests'))
    }
    mergedSentOf(experimentId: string){
        return new BaseCollection(this.collection.doc(experimentId).collection('merged-sent'))
    }

    mergedWordOf(experimentId: string){
        return new BaseCollection(this.collection.doc(experimentId).collection('merged-word'))
    }

    formsOf(experimentId: string){
        return new Forms(this.collection.doc(experimentId).collection('forms'))
    }   

    customSummariesOf(experimentId: string){
        return new BaseCollection(this.collection.doc(experimentId).collection('custom-summaries'))
    }
}