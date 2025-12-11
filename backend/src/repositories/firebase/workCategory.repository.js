const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');

/**
 * smetaWorks / workCategories
 * data: [ { name, ... } ]
 * item: {name: string}
 */
class FirebaseWorkCategoryRepository extends FirebaseArrayDocRepository {
  constructor(db) {
    // В качестве идентификатора используем поле "name"
    super(db, 'SmetaWorks', 'WorkCategories', 'name');
  }
}

module.exports = FirebaseWorkCategoryRepository;


