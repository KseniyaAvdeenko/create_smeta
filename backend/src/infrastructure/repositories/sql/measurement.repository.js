const BaseRepository = require('./base.repository');

class MeasurementRepository extends BaseRepository {
  constructor(MeasurementModel, WorkMeasurementModel) {
    super(MeasurementModel);
    this.WorkMeasurement = WorkMeasurementModel;
  }

  async getByIdWithRelations(id) {
    return this.findById(id, {
      include: [{ model: this.WorkMeasurement, as: 'workMeasurements' }],
    });
  }

  async getAllWithRelations() {
    return this.findAll({}, {
      include: [{ model: this.WorkMeasurement, as: 'workMeasurements' }],
      order: [['shortName', 'ASC']],
    });
  }
}

module.exports = MeasurementRepository;
