const BaseRepository = require('./base.repository');

class TokenRepository extends BaseRepository {
  constructor(TokenModel, UserModel) {
    super(TokenModel);
    this.User = UserModel;
  }

  async getByUserId(userId) {
    return this.findAll({ userId });
  }

  async createForUser(userId, refresh, userAgent = null) {
    return this.create({ userId, refresh, userAgent });
  }

  async deleteByRefresh(refresh) {
    const record = await this.findOne({ refresh });
    if (!record) return 0;
    await record.destroy();
    return 1;
  }

  async deleteAllByUserId(userId) {
    const records = await this.findAll({ userId });
    for (const record of records) {
      await record.destroy();
    }
    return records.length;
  }
}

module.exports = TokenRepository;
