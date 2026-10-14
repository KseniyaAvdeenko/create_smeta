const BaseRepository = require('./base.repository');

class WorkCategoryRepository extends BaseRepository {
  constructor(WorkCategoryModel, WorkModel, UserModel) {
    super(WorkCategoryModel);
    this.Work = WorkModel;
    this.User = UserModel;
  }

  async getByIdWithWorks(id) {
    return this.findById(id, {
      include: [{ model: this.Work, as: 'works' }],
    });
  }

  async getAllByUserId(userId) {
    return this.findAll(
      { userId },
      {
        include: [{ model: this.Work, as: 'works' }],
        order: [['name', 'ASC']],
      },
    );
  }
}

module.exports = WorkCategoryRepository;
