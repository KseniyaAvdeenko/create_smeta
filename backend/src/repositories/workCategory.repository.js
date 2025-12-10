const BaseRepository = require('./base.repository');

class WorkCategoryRepository extends BaseRepository {
  constructor(WorkCategoryModel) {
    super(WorkCategoryModel);
  }
}

module.exports = WorkCategoryRepository;


