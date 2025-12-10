const BaseRepository = require('./base.repository');

class OrderWorkRepository extends BaseRepository {
  constructor(OrderWorkModel) {
    super(OrderWorkModel);
  }
}

module.exports = OrderWorkRepository;


