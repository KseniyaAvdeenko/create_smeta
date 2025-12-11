const admin = require('firebase-admin');
const firebaseConfig = require('../../config/firebase.config')

if (!admin.apps.length) admin.initializeApp({credential: admin.credential.cert(firebaseConfig)});

const db = admin.firestore();

module.exports = {
  admin,
  db,
};