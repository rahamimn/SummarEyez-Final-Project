const admin = require('firebase-admin');
const serviceAccount = require('./serviceAcountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "text-summarization-262015.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const run = async () => {
  const collection = await db.collection('images').get()
  await bucket.upload('./test1.jpg', {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  await bucket.file('test1.jpg').download({destination: './test123.jpg', validation: false});

}
run();
