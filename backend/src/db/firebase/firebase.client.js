const admin = require('firebase-admin');
const googleConfigs = require('../../config/google.config')

if (!admin.apps.length) admin.initializeApp({credential: admin.credential.cert(googleConfigs)});

const db = admin.firestore();

module.exports = {
  admin,
  db,
};