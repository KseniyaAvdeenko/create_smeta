const bcrypt = require('bcrypt');
const { seedUserCatalog } = require('../../db/seed/catalogSeed.service');

const SALT_ROUNDS = 10;

class AuthService {
  /**
   * @param {import('../repositories/sql/user.repository')} userRepository
   * @param {import('sequelize').ModelStatic} [WorkCategoryModel]
   * @param {import('sequelize').ModelStatic} [WorkModel]
   * @param {import('sequelize').ModelStatic} [WorkMeasurementModel]
   * @param {import('sequelize').ModelStatic} [MeasurementModel]
   */
  constructor(userRepository, models = null) {
    this.userRepository = userRepository;
    this.models = models;
    this.currentUser = null;
  }

  async login(login, password) {
    const user = await this.userRepository.findByLogin(login);
    if (!user) {
      return { success: false, error: 'Неверный логин или пароль' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Неверный логин или пароль' };
    }

    this.currentUser = this.userRepository.toSafeUser(user);
    await this.ensureUserCatalog(user.id);
    return { success: true, user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    return { success: true };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async register({ username, email, password, isAdmin = false }) {
    const existing = await this.userRepository.findByLogin(email);
    if (existing) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const existingUsername = await this.userRepository.findOne({ username });
    if (existingUsername) {
      return { success: false, error: 'Пользователь с таким именем уже существует' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.createWithSettings({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    this.currentUser = this.userRepository.toSafeUser(user);
    await this.ensureUserCatalog(user.id);
    return { success: true, user: this.currentUser };
  }

  async ensureUserCatalog(userId) {
    if (!this.models) return;
    await seedUserCatalog(this.models, userId);
  }

  async hasUsers() {
    const count = await this.userRepository.model.count();
    return count > 0;
  }
}

module.exports = AuthService;
