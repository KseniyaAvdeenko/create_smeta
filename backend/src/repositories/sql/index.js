const WorkRepository = require('./work.repository');
const WorkCategoryRepository = require('./workCategory.repository');
const MeasurementRepository = require('./measurement.repository');
const OrderRepository = require('./order.repository');
const OrderWorkRepository = require('./orderWork.repository');
const SavedFileRepository = require('./savedFile.repository');

/**
 * Фабрика репозиториев поверх Sequelize-моделей.
 * @param {{ WorkCategory, Measurement, Work, Order, OrderWork, SavedFile }} models
 */
function createRepositories(models) {
  return {
    workRepository: new WorkRepository(models.Work),
    workCategoryRepository: new WorkCategoryRepository(models.WorkCategory),
    measurementRepository: new MeasurementRepository(models.Measurement),
    orderRepository: new OrderRepository(
      models.Order,
      models.OrderWork,
      models.Work,
      models.SavedFile,
    ),
    orderWorkRepository: new OrderWorkRepository(models.OrderWork),
    savedFileRepository: new SavedFileRepository(models.SavedFile),
  };
}

module.exports = {
  createRepositories,
};


