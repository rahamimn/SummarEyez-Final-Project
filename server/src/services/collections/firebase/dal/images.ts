import { BaseCollection } from "./baseCollection";
import { SentTable } from "./sentTables";
import { Questions } from "./questions";

export class Images extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    sentTablesOf = (imageName: string) => new SentTable(this.collection.doc(imageName).collection('sent_tables'))

    questionsOf = (imageName: string) => new Questions(this.collection.doc(imageName).collection('questions'))
}