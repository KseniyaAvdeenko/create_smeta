const BaseRepository = require('./base.repository');

class WorkRepository extends BaseRepository {
  constructor(WorkModel, WorkCategoryModel, WorkMeasurementModel, MeasurementModel) {
    super(WorkModel);
    this.WorkCategory = WorkCategoryModel;
    this.WorkMeasurement = WorkMeasurementModel;
    this.Measurement = MeasurementModel;
  }

  _defaultInclude() {
    return [
      { model: this.WorkCategory, as: 'category' },
      {
        model: this.WorkMeasurement,
        as: 'workMeasurements',
        include: [{ model: this.Measurement, as: 'measurement' }],
      },
    ];
  }

  async getById(id) {
    return this.findById(id, { include: this._defaultInclude() });
  }

  async getAllByUserId(userId) {
    return this.findAll({ userId }, { include: this._defaultInclude() });
  }

  async findByCategory(categoryId) {
    return this.findAll({ categoryId }, { include: this._defaultInclude() });
  }
}

module.exports = WorkRepository;
