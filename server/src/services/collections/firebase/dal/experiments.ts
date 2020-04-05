import { SentTable } from './sentTables';
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
    mergedSentOf(experimentId: string){
        
        return new SentTable(this.collection.doc(experimentId).collection('merged-sent'))
    }

    mergedWordOf(experimentId: string){
        return new SentTable(this.collection.doc(experimentId).collection('merged-word'))
    }
}