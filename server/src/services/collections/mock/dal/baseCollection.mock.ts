import { BaseCollection } from "../../firebase/dal/baseCollection";

export class BaseCollectionMock implements BaseCollection{
    collection;
    private subCollections: Map<string,Map<string,BaseCollectionMock>>;
    constructor(collection){
        this.collection = collection;
        this.subCollections = new Map();
    }

    getAll = async () => Object.keys(this.collection).map( key => ({id:key, data:this.collection[key]}))

    add = async (id,data) => {
        this.collection[id] = data;
    }    
    
    get = async (id: string) => this.collection[id];

    getSubCollectionOf = (id, subCollectionName, SubCollectionType) => {
        if(!this.subCollections.has(id)){
            const subCol = new Map();
            subCol.set(subCollectionName,new SubCollectionType({}));
            this.subCollections.set(id, subCol);
        }
        else if(!this.subCollections.get(id).has(subCollectionName)){
            this.subCollections.get(id).set(subCollectionName, new SubCollectionType({}));
        }
        return this.subCollections.get(id).get(subCollectionName);
    }

}