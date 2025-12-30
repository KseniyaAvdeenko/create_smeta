const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / measurements
 * data: [ item ]
 *item: {id: string}
 */
class FirebaseMeasurementRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'SmetaWorks', 'Measurements', 'id');
  }
}

module.exports = FirebaseMeasurementRepository;


