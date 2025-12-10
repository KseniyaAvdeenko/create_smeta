const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaOrders / orderWorks
 * data: [ { id, orderId, workId, measureQuantity, ... } ]
 */
class FirebaseOrderWorkRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'smetaOrders', 'orderWorks', 'id');
  }

  async getByOrderId(orderId) {
    const all = await this.getAll();
    return all.filter((ow) => ow.orderId === orderId);
  }
}

module.exports = FirebaseOrderWorkRepository;


