import { AutomaticAlgorithms } from "./dal/automatic-algorithms";
import { Images } from "./dal/images";
import { Experiments } from "./dal/experiments";
const admin = require('firebase-admin');
const serviceAccount = require('../../../../serviceAcountKey.json');


export class Firestore {
    private db;
    constructor(){
        if(!admin.apps.length){
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: "summareyez-6b61e.appspot.com"
            });
        }
        this.db = admin.firestore();
    }

    automaticAlgos = () => new AutomaticAlgorithms(this.db.collection('automatic-algorithms'));
    images = () => new Images(this.db.collection('images'));
    experiments = () => new Experiments(this.db.collection('experiments'));
    createBatch = () => this.db.batch();
}