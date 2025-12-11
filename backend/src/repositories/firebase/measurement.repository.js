const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / measurements
 * data: [ { id, ... } ]
 *item: {id: string}
 */
class FirebaseMeasurementRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'smetaWorks', 'measurements', 'id');
  }
}

module.exports = FirebaseMeasurementRepository;


