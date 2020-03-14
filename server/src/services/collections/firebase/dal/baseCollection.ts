export class BaseCollection {
    collection;
    constructor(collection){
        this.collection = collection;
    }

    getAll = async () => {
        const snapshot = await  this.collection.get();
        return snapshot.docs.map(doc => ({id : doc.id ,data: doc.data()}));
    }  

    add = (id,data) => {
        return this.collection.doc(id).set(data)
    }    
    
    get = async (id: string) => (await this.collection.doc(id).get()).data();

}