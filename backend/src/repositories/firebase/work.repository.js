const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / works
 * data: [ { id, name, categoryName, measurementId, cost, ... } ]
 * item: {id: int,
 * name: str,
 * category: str,
 * isDefault: boolean
 * workMeasurements: [{measurement:string, cost: float}],
 * }
 */
class FirebaseWorkRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'SmetaWorks', 'Works', 'id');
  }

  async findByCategory(categoryName) {
    const all = await this.getAll();
    return all.filter((w) => w.categoryName === categoryName);
  }
}

module.exports = FirebaseWorkRepository;


