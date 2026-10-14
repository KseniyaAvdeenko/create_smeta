const BaseRepository = require('./base.repository');

class WorkMeasurementRepository extends BaseRepository {
  constructor(WorkMeasurementModel, WorkModel, MeasurementModel) {
    super(WorkMeasurementModel);
    this.Work = WorkModel;
    this.Measurement = MeasurementModel;
  }

  async getByWorkId(workId) {
    return this.findAll(
      { workId },
      {
        include: [{ model: this.Measurement, as: 'measurement' }],
      },
    );
  }

  async getByIdWithRelations(id) {
    return this.findById(id, {
      include: [
        { model: this.Work, as: 'work' },
        { model: this.Measurement, as: 'measurement' },
      ],
    });
  }
}

module.exports = WorkMeasurementRepository;
