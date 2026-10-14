const BaseRepository = require('./base.repository');

class OrderRepository extends BaseRepository {
  constructor(
    OrderModel,
    OrderWorkModel,
    WorkModel,
    SavedFileModel,
    OrderWorkQuantityModel,
    WorkMeasurementModel,
    MeasurementModel,
    WorkCategoryModel,
    UserModel,
  ) {
    super(OrderModel);
    this.OrderWork = OrderWorkModel;
    this.Work = WorkModel;
    this.SavedFile = SavedFileModel;
    this.OrderWorkQuantity = OrderWorkQuantityModel;
    this.WorkMeasurement = WorkMeasurementModel;
    this.Measurement = MeasurementModel;
    this.WorkCategory = WorkCategoryModel;
    this.User = UserModel;
  }

  async getAllByUserId(userId) {
    return this.findAll(
      { createdBy: userId },
      {
        include: [{ model: this.SavedFile, as: 'savedOrderFiles' }],
        order: [['createdAt', 'DESC']],
      },
    );
  }

  async getOrderWithDetails(id) {
    return this.model.findByPk(id, {
      include: [
        { model: this.User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: this.OrderWork,
          as: 'orderWorks',
          include: [
            {
              model: this.Work,
              as: 'work',
              include: [
                { model: this.WorkCategory, as: 'category' },
                {
                  model: this.WorkMeasurement,
                  as: 'workMeasurements',
                  include: [{ model: this.Measurement, as: 'measurement' }],
                },
              ],
            },
            {
              model: this.OrderWorkQuantity,
              as: 'orderWorkQuantities',
            },
          ],
        },
        {
          model: this.SavedFile,
          as: 'savedOrderFiles',
        },
      ],
    });
  }
}

module.exports = OrderRepository;
