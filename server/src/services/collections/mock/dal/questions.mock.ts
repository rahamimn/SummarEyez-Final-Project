import { TestsMock } from "./tests.mock";
import { BaseCollectionMock } from "./baseCollection.mock";
import { Experiments } from "../../firebase/dal/experiments";
import { SentTableMock } from './sentTables.mock';
import { Questions } from '../../firebase/dal/questions';

export class QuesionsMock extends BaseCollectionMock {
    collection;
    
    constructor(collection){
        super(collection);
        this.collection = collection;
    }
}