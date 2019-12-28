const admin = require('firebase-admin');
const serviceAccount = require('./serviceAcountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const run = async () => {
    const collection = await db.collection('images').get()
}
run();