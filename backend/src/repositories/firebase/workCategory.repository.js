const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / workCategories
 * data: [ { name, ... } ]
 * item: {name: string}
 */
class FirebaseWorkCategoryRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    super(db, 'SmetaWorks', 'WorkCategories', 'id');
  }
}

module.exports = FirebaseWorkCategoryRepository;


