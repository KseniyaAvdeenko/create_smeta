const UserRepository = require('./user.repository');
const UserSettingsRepository = require('./userSettings.repository');
const GdriveConnectionRepository = require('./gdriveConnection.repository');
const OAuthTokenRepository = require('./oauthToken.repository');
const TokenRepository = require('./token.repository');
const WorkRepository = require('./work.repository');
const WorkCategoryRepository = require('./workCategory.repository');
const MeasurementRepository = require('./measurement.repository');
const WorkMeasurementRepository = require('./workMeasurement.repository');
const OrderRepository = require('./order.repository');
const OrderWorkRepository = require('./orderWork.repository');
const OrderWorkQuantityRepository = require('./orderWorkQuantity.repository');
const SavedFileRepository = require('./savedFile.repository');

/**
 * @param {Record<string, import('sequelize').ModelStatic>} models
 */
function createRepositories(models) {
  return {
    userRepository: new UserRepository(
      models.user,
      models.user_settings,
      models.gdrive_connection,
    ),
    userSettingsRepository: new UserSettingsRepository(models.user_settings, models.user),
    gdriveConnectionRepository: new GdriveConnectionRepository(
      models.gdrive_connection,
      models.user,
    ),
    oauthTokenRepository: new OAuthTokenRepository(models.oauth_token),
    tokenRepository: new TokenRepository(models.token, models.user),
    workRepository: new WorkRepository(
      models.work,
      models.work_category,
      models.work_measurement,
      models.measurement,
    ),
    workCategoryRepository: new WorkCategoryRepository(
      models.work_category,
      models.work,
      models.user,
    ),
    measurementRepository: new MeasurementRepository(models.measurement, models.work_measurement),
    workMeasurementRepository: new WorkMeasurementRepository(
      models.work_measurement,
      models.work,
      models.measurement,
    ),
    orderRepository: new OrderRepository(
      models.order,
      models.order_work,
      models.work,
      models.save_order_file,
      models.order_work_quantity,
      models.work_measurement,
      models.measurement,
      models.work_category,
      models.user,
    ),
    orderWorkRepository: new OrderWorkRepository(
      models.order_work,
      models.order_work_quantity,
      models.work,
      models.work_category,
    ),
    orderWorkQuantityRepository: new OrderWorkQuantityRepository(
      models.order_work_quantity,
      models.order_work,
    ),
    savedFileRepository: new SavedFileRepository(
      models.save_order_file,
      models.order,
      models.user,
    ),
  };
}

module.exports = {
  createRepositories,
};
