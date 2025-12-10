const { postgresConfig } = require('../config/db.config');
const DatabaseClient = require('../db/sql/db.client');
const { createRepositories } = require('../repositories');

class DbHandler {
  constructor() {
    this.dbClient = new DatabaseClient(postgresConfig);
    this.repositories = createRepositories(this.dbClient.models);
  }

  getDbConnection = async () => this.dbClient.connect();

  // Геттеры для репозиториев – чтобы использовать их в IPC/сервисах
  get workRepository() {
    return this.repositories.workRepository;
  }

  get workCategoryRepository() {
    return this.repositories.workCategoryRepository;
  }

  get measurementRepository() {
    return this.repositories.measurementRepository;
  }

  get orderRepository() {
    return this.repositories.orderRepository;
  }

  get orderWorkRepository() {
    return this.repositories.orderWorkRepository;
  }

  get savedFileRepository() {
    return this.repositories.savedFileRepository;
  }
}

module.exports = DbHandler;