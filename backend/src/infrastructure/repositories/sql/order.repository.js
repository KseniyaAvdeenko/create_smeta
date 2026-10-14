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

  async createWithCatalog(data) {
    const orderId = await this.model.sequelize.transaction(async (transaction) => {
      const order = await this.model.create(data, { transaction });
      const works = await this.Work.findAll({
        where: { userId: data.createdBy },
        transaction,
      });

      works.sort((a, b) => (a.categoryId - b.categoryId) || (a.id - b.id));

      if (works.length) {
        await this.OrderWork.bulkCreate(
          works.map((work) => ({
            workId: work.id,
            orderId: order.id,
            total: 0,
          })),
          { transaction },
        );
      }

      return order.id;
    });

    return this.getOrderWithDetails(orderId);
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
