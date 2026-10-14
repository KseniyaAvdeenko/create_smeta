const BaseRepository = require('./base.repository');

class GdriveConnectionRepository extends BaseRepository {
  constructor(GdriveConnectionModel, UserModel) {
    super(GdriveConnectionModel);
    this.User = UserModel;
  }

  async getByUserId(userId) {
    return this.findOne({ userId });
  }

  async upsertForUser(userId, { access, refresh, email, defaultFolder = null }) {
    const existing = await this.getByUserId(userId);

    if (existing) {
      return existing.update({
        access,
        refresh: refresh || existing.refresh,
        email,
        ...(defaultFolder !== null ? { defaultFolder } : {}),
      });
    }

    return this.create({
      userId,
      access,
      refresh,
      email,
      defaultFolder,
    });
  }

  async updateTokens(userId, tokens) {
    const connection = await this.getByUserId(userId);
    if (!connection) return null;

    const updateData = {};
    if (tokens.access_token) updateData.access = tokens.access_token;
    if (tokens.refresh_token) updateData.refresh = tokens.refresh_token;

    return connection.update(updateData);
  }

  async updateDefaultFolder(userId, defaultFolder) {
    const connection = await this.getByUserId(userId);
    if (!connection) return null;
    return connection.update({ defaultFolder });
  }

  async deleteByUserId(userId) {
    const connection = await this.getByUserId(userId);
    if (!connection) return 0;
    await connection.destroy();
    return 1;
  }

  toPublicConnection(connection) {
    if (!connection) return null;
    const plain = connection.get ? connection.get({ plain: true }) : { ...connection };
    delete plain.access;
    delete plain.refresh;
    return plain;
  }
}

module.exports = GdriveConnectionRepository;
