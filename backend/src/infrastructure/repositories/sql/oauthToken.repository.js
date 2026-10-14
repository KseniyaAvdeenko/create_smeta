const crypto = require('crypto');
const BaseRepository = require('./base.repository');

class OAuthTokenRepository extends BaseRepository {
  constructor(OAuthTokenModel) {
    super(OAuthTokenModel);
  }

  async createState(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    await this.create({ userId, token });
    return token;
  }

  async findByToken(token) {
    return this.findOne({ token });
  }

  async deleteByToken(token) {
    const record = await this.findByToken(token);
    if (!record) return 0;
    await record.destroy();
    return 1;
  }

  async deleteByUserId(userId) {
    const records = await this.findAll({ userId });
    for (const record of records) {
      await record.destroy();
    }
    return records.length;
  }
}

module.exports = OAuthTokenRepository;
