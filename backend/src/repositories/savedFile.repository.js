const BaseRepository = require('./base.repository');

class SavedFileRepository extends BaseRepository {
  constructor(SavedFileModel) {
    super(SavedFileModel);
  }
}

module.exports = SavedFileRepository;


