const BaseRepository = require('./base.repository');

class WorkRepository extends BaseRepository {
  constructor(WorkModel) {
    super(WorkModel);
  }

  async findByCategory(categoryName) {
    return this.findAll({ categoryName });
  }
}

module.exports = WorkRepository;


