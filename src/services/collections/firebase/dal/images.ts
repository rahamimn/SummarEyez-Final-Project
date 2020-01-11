import { BaseCollection } from "./baseCollection";
import { SentTable } from "./sentTables";

export class Images extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
    sentTablesOf = (imageName: string) => new SentTable(this.collection.doc(imageName).collection('sent_tables'))
}