const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / works
 * data: [ { id, name, categoryName, measurementId, cost, ... } ]
 * item: {id: int,
 * name: str,
 * category: str,
 * measurement: string,
 * cost: int
 * }
 */
class FirebaseWorkRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'smetaWorks', 'works', 'id');
  }

  async findByCategory(categoryName) {
    const all = await this.getAll();
    return all.filter((w) => w.categoryName === categoryName);
  }
}

module.exports = FirebaseWorkRepository;


