const BaseRepository = require('./base.repository');

class OrderWorkQuantityRepository extends BaseRepository {
  constructor(OrderWorkQuantityModel, OrderWorkModel) {
    super(OrderWorkQuantityModel);
    this.OrderWork = OrderWorkModel;
  }

  async getByOrderWorkId(orderWorkId) {
    return this.findAll({ orderWorkId });
  }

  async getByIdWithOrderWork(id) {
    return this.findById(id, {
      include: [{ model: this.OrderWork, as: 'orderWork' }],
    });
  }
}

module.exports = OrderWorkQuantityRepository;
