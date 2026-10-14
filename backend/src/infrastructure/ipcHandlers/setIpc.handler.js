const { getDbHandler } = require('./db.handler');
const { loadEnv } = require('../../common/config/env');
const registerAppHandlers = require('./handlers/app.handler');
const registerAuthHandlers = require('./handlers/auth.handler');
const registerGdriveHandlers = require('./handlers/gdrive.handler');
const registerUserSettingsHandlers = require('./handlers/userSettings.handler');
const registerCatalogHandlers = require('./handlers/catalog.handler');
const registerOrderHandlers = require('./handlers/orders.handler');

loadEnv();

function setIpcHandlers() {
  const db = getDbHandler();
  const authService = db.authServiceInstance();

  registerAppHandlers({ db });
  registerAuthHandlers({ authService, userRepository: db.userRepository() });
  registerGdriveHandlers({ authService, gdriveService: db.gdriveServiceInstance() });
  registerUserSettingsHandlers({
    authService,
    userSettingsRepository: db.userSettingsRepository(),
  });
  registerCatalogHandlers({
    authService,
    measurementRepo: db.measurementRepository(),
    workCategoryRepo: db.workCategoryRepository(),
    worksRepo: db.workRepository(),
    workMeasurementRepo: db.workMeasurementRepository(),
  });
  registerOrderHandlers({
    authService,
    orderRepo: db.orderRepository(),
    orderWorksRepo: db.orderWorkRepository(),
    orderWorkQuantityRepo: db.orderWorkQuantityRepository(),
    savedFilesRepo: db.savedFileRepository(),
  });
}

module.exports = setIpcHandlers;
