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

  async findByCategory(categoryId) {
    const all = await this.getAll();
    return all.filter((w) => w.categoryId === categoryId);
  }
}

module.exports = FirebaseWorkRepository;


