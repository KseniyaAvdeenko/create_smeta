const { Sequelize } = require('sequelize');
const { initModels } = require('./models');
const { seedDefaultMeasurements } = require('../seed/catalogSeed.service');

class DatabaseClient {
  /**
   * @param {ReturnType<import('../../common/config/db.config').getDatabaseConfig>} config
   */
  constructor(config) {
    this.config = config;
    this.connected = false;

    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: config.storage,
      logging: false,
    });

    this.models = initModels(this.sequelize);
  }

  async connect() {
    if (this.connected) return true;

    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });
      await seedDefaultMeasurements(this.models);
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Unable to connect to the database:', error.message);
      return false;
    }
  }
}

module.exports = DatabaseClient;
