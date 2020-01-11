export class BaseCollection {
    collection;
    constructor(collection){
        this.collection = collection;
    }

    get = () => {
        return this.collection.get()
    }  

    add = (id,data) => {
        return this.collection.doc(id).set(data)
    }     

}