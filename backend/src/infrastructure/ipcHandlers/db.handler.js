const path = require('path');
const process = require('node:process');
const { app } = require('electron');
const { loadEnv } = require('../../common/config/env');
const { getDatabaseConfig } = require('../../common/config/db.config');
const SqlDatabaseClient = require('../../db/sql/db.client');
const { createRepositories } = require('../repositories/sql');
const AuthService = require('../services/auth.service');
const GdriveService = require('../services/gdrive.service');

loadEnv();

let instance = null;

class DbHandler {
  constructor() {
    const config = getDatabaseConfig({
      storage: app.isPackaged
        ? path.join(app.getPath('userData'), 'smeta.db')
        : process.env.DB_STORAGE || path.join(process.cwd(), 'smeta.db'),
    });

    this.dialect = config.dialect;
    this.dbClient = new SqlDatabaseClient(config);
    this.repositories = createRepositories(this.dbClient.models);

    this.gdriveService = new GdriveService(
      this.repositories.gdriveConnectionRepository,
      this.repositories.oauthTokenRepository,
    );
    this.repositories.savedFileRepository.setGdriveService(this.gdriveService);

    this.authService = new AuthService(this.repositories.userRepository, this.dbClient.models);
  }

  getDbConnection = async () => this.dbClient.connect();

  authServiceInstance() {
    return this.authService;
  }

  gdriveServiceInstance() {
    return this.gdriveService;
  }

  userRepository() {
    return this.repositories.userRepository;
  }

  userSettingsRepository() {
    return this.repositories.userSettingsRepository;
  }

  gdriveConnectionRepository() {
    return this.repositories.gdriveConnectionRepository;
  }

  tokenRepository() {
    return this.repositories.tokenRepository;
  }

  workRepository() {
    return this.repositories.workRepository;
  }

  workCategoryRepository() {
    return this.repositories.workCategoryRepository;
  }

  measurementRepository() {
    return this.repositories.measurementRepository;
  }

  workMeasurementRepository() {
    return this.repositories.workMeasurementRepository;
  }

  orderRepository() {
    return this.repositories.orderRepository;
  }

  orderWorkRepository() {
    return this.repositories.orderWorkRepository;
  }

  orderWorkQuantityRepository() {
    return this.repositories.orderWorkQuantityRepository;
  }

  savedFileRepository() {
    return this.repositories.savedFileRepository;
  }
}

function getDbHandler() {
  if (!instance) {
    instance = new DbHandler();
  }
  return instance;
}

async function ensureDbReady() {
  return getDbHandler().getDbConnection();
}

module.exports = { DbHandler, getDbHandler, ensureDbReady };
