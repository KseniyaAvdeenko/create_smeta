const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaOrders / orderWorks
 * data: [ { id, orderId, workId, measureQuantity, ... } ]
 * item: {id: int, workId: int, orderId: int, measureQuantities: [{measurement:string, quantity: float}]}
 */
class FirebaseOrderWorkRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'SmetaOrders', 'OrderWorks', 'id');
  }

  async getByOrderId(orderId) {
    const all = await this.getAll();
    return all.filter((ow) => ow.orderId === orderId);
  }
}

module.exports = FirebaseOrderWorkRepository;


