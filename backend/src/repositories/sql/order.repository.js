const BaseRepository = require('./base.repository');

class OrderRepository extends BaseRepository {
  /**
   * @param {import('sequelize').Model} OrderModel
   * @param {import('sequelize').Model} OrderWorkModel
   * @param {import('sequelize').Model} WorkModel
   * @param {import('sequelize').Model} SavedFileModel
   */
  constructor(OrderModel, OrderWorkModel, WorkModel, SavedFileModel) {
    super(OrderModel);
    this.OrderWork = OrderWorkModel;
    this.Work = WorkModel;
    this.SavedFile = SavedFileModel;
  }

  /**
   * Получить заказ со всеми работами и сохранёнными файлами.
   */
  async findWithDetails(id) {
    return this.model.findByPk(id, {
      include: [
        {
          model: this.OrderWork,
          as: 'orderWorks',
          include: [
            {
              model: this.Work,
              as: 'work',
            },
          ],
        },
        {
          model: this.SavedFile,
          as: 'savedFiles',
        },
      ],
    });
  }
}

module.exports = OrderRepository;


