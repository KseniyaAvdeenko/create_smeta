const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaOrders / orderFiles
 * data: [ { id, orderId, name, date, ... } ]
 */
class FirebaseSavedFileRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    // Документ "orderFiles" в коллекции smetaOrders
    super(db, 'smetaOrders', 'orderFiles', 'id');
  }

  async getByOrderId(orderId) {
    const all = await this.getAll();
    return all.filter((f) => f.orderId === orderId);
  }
}

module.exports = FirebaseSavedFileRepository;


