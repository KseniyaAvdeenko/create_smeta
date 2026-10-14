const BaseRepository = require('./base.repository');

class UserSettingsRepository extends BaseRepository {
  constructor(UserSettingsModel, UserModel) {
    super(UserSettingsModel);
    this.User = UserModel;
  }

  async getByUserId(userId) {
    return this.findOne({ userId });
  }

  async upsertByUserId(userId, data) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      return existing.update(data);
    }
    return this.create({ userId, ...data });
  }

  async getWithUser(userId) {
    return this.findOne(
      { userId },
      {
        include: [{ model: this.User, as: 'user', attributes: { exclude: ['password'] } }],
      },
    );
  }
}

module.exports = UserSettingsRepository;
