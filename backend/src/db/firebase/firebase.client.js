const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDBWkThUHLfARda47jXjbcjGqZVumB1fQ0',
  authDomain: 'smetagen.firebaseapp.com',
  projectId: 'smetagen',
  storageBucket: 'smetagen.firebasestorage.app',
  messagingSenderId: '641822262382',
  appId: '1:641822262382:web:55c7d8da4677cd97ef127f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
  app,
  db,
};