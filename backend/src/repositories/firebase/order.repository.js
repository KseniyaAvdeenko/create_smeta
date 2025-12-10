const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');
const FirebaseOrderWorkRepository = require('./orderWork.repository');
const FirebaseSavedFileRepository = require('./savedFile.repository');
const { db } = require('../../db/firebase/firebase.client');

/**
 * smetaOrders / orders
 * data: [ { id, name, client, date, ... } ]
 *
 * Для удобства здесь же есть метод получения заказа с работами и файлами.
 */
class FirebaseOrderRepository extends FirebaseArrayDocRepository {
  constructor(firestoreDb = db) {
    super(firestoreDb, 'smetaOrders', 'orders', 'id');
    this.orderWorkRepo = new FirebaseOrderWorkRepository(firestoreDb);
    this.savedFileRepo = new FirebaseSavedFileRepository(firestoreDb);
  }

  /**
   * Получить заказ со связанными работами и файлами.
   * orderWorks: smetaOrders/orderWorks.data
   * orderFiles: smetaOrders/orderFiles.data
   */
  async getOrderWithDetails(orderId) {
    const order = await this.getById(orderId);
    if (!order) return null;

    const [orderWorks, orderFiles] = await Promise.all([
      this.orderWorkRepo.getByOrderId(orderId),
      this.savedFileRepo.getByOrderId(orderId),
    ]);

    return {
      ...order,
      orderWorks,
      orderFiles,
    };
  }
}

module.exports = FirebaseOrderRepository;


