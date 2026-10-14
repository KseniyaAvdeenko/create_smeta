const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor(UserModel, UserSettingsModel, GdriveConnectionModel) {
    super(UserModel);
    this.UserSettings = UserSettingsModel;
    this.GdriveConnection = GdriveConnectionModel;
  }

  async findByLogin(login) {
    return this.model.findOne({
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    });
  }

  async findByIdWithProfile(id) {
    return this.model.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: this.UserSettings, as: 'settings' },
        {
          model: this.GdriveConnection,
          as: 'gdriveConnection',
          attributes: { exclude: ['access', 'refresh'] },
        },
      ],
    });
  }

  async createWithSettings(data) {
    const user = await this.model.create(data);
    if (this.UserSettings) {
      await this.UserSettings.create({ userId: user.id });
    }
    return user;
  }

  toSafeUser(user) {
    if (!user) return null;
    const plain = user.get ? user.get({ plain: true }) : { ...user };
    return {
      id: plain.id,
      username: plain.username,
      email: plain.email,
      isAdmin: Boolean(plain.isAdmin),
    };
  }
}

module.exports = UserRepository;
