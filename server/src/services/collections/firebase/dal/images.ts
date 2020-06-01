import { BaseCollection } from "./baseCollection";
import { Questions } from "./questions";

export class Images extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    sentTablesOf = (imageName: string) => new BaseCollection(this.collection.doc(imageName).collection('sent_tables'))

    questionsOf = (imageName: string) => new Questions(this.collection.doc(imageName).collection('questions'))
}