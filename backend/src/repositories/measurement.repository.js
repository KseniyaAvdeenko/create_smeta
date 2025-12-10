const BaseRepository = require('./base.repository');

class MeasurementRepository extends BaseRepository {
  constructor(MeasurementModel) {
    super(MeasurementModel);
  }
}

module.exports = MeasurementRepository;


