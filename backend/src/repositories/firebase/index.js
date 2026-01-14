const { db } = require('../../db/firebase/firebase.client');
const FirebaseWorkRepository = require('./work.repository');
const FirebaseWorkCategoryRepository = require('./workCategory.repository');
const FirebaseMeasurementRepository = require('./measurement.repository');
const FirebaseOrderRepository = require('./order.repository');
const FirebaseOrderWorkRepository = require('./orderWork.repository');
const FirebaseSavedFileRepository = require('./savedFile.repository');

/**
 * Фабрика репозиториев для Firebase-хранилища.
 * Ожидается структура:
 * - smetaWorks / works         -> data: [works...]
 * - smetaWorks / workCategories -> data: [categories...]
 * - smetaWorks / measurements   -> data: [measurements...]
 * - smetaOrders / orders        -> data: [orders...]
 * - smetaOrders / orderWorks    -> data: [orderWorks...]
 * - smetaOrders / orderFiles    -> data: [files...]
 *
 * @param {import('firebase/firestore').Firestore} firestoreDb
 */
function createFirebaseRepositories(firestoreDb = db) {
  return {
    workRepository: new FirebaseWorkRepository(firestoreDb),
    workCategoryRepository: new FirebaseWorkCategoryRepository(firestoreDb),
    measurementRepository: new FirebaseMeasurementRepository(firestoreDb),
    orderRepository: new FirebaseOrderRepository(firestoreDb),
    orderWorkRepository: new FirebaseOrderWorkRepository(firestoreDb),
    savedFileRepository: new FirebaseSavedFileRepository(firestoreDb),
  };
}

module.exports = {
  createFirebaseRepositories,
};


