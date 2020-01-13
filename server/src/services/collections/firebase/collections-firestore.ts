import { AutomaticAlgorithms } from "./dal/automatic-algorithms";
import { Images } from "./dal/images";

const admin = require('firebase-admin');
const serviceAccount = require('../../../../serviceAcountKey.json');


export class Firestore {
    private db;
    constructor(){
        if(!admin.apps.length){
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: "text-summarization-262015.appspot.com"
            });
        }
        this.db = admin.firestore();
    }

    automaticAlgos = () => new AutomaticAlgorithms(this.db.collection('automatic-algorithms'));
    images = () => new Images(this.db.collection('images'));
}