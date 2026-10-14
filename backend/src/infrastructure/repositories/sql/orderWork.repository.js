const BaseRepository = require('./base.repository');

class OrderWorkRepository extends BaseRepository {
  constructor(OrderWorkModel, OrderWorkQuantityModel, WorkModel, WorkCategoryModel) {
    super(OrderWorkModel);
    this.OrderWorkQuantity = OrderWorkQuantityModel;
    this.Work = WorkModel;
    this.WorkCategory = WorkCategoryModel;
  }

  _defaultInclude() {
    return [
      {
        model: this.Work,
        as: 'work',
        include: [{ model: this.WorkCategory, as: 'category' }],
      },
      {
        model: this.OrderWorkQuantity,
        as: 'orderWorkQuantities',
      },
    ];
  }

  async getById(id) {
    return this.findById(id, { include: this._defaultInclude() });
  }

  async getByOrderId(orderId) {
    return this.findAll({ orderId }, { include: this._defaultInclude() });
  }
}

module.exports = OrderWorkRepository;
