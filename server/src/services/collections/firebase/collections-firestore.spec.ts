import {Firestore} from "./collections-firestore";

describe('Firestore tests',() => {
let firestore : Firestore;
    beforeEach(() => {
        firestore = new Firestore();
    })

    it('automatic get', async () => {
        const res = await firestore.automaticAlgos().get();
    })
})           