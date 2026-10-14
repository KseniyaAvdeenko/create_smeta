const BaseRepository = require('./base.repository');
const excelGenerationService = require('../../services/excelGeneration.service');

class SavedFileRepository extends BaseRepository {
  constructor(SavedFileModel, OrderModel, UserModel) {
    super(SavedFileModel);
    this.Order = OrderModel;
    this.User = UserModel;
    this.gdriveService = null;
  }

  setGdriveService(gdriveService) {
    this.gdriveService = gdriveService;
  }

  async getByOrderId(orderId) {
    return this.findAll(
      { orderId },
      {
        include: [
          { model: this.Order, as: 'order' },
          { model: this.User, as: 'user', attributes: { exclude: ['password'] } },
        ],
      },
    );
  }

  async getById(id) {
    return this.findById(id, {
      include: [
        { model: this.Order, as: 'order' },
        { model: this.User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });
  }

  async getAllByUserId(userId) {
    return this.findAll(
      { createdBy: userId },
      {
        include: [{ model: this.Order, as: 'order' }],
        order: [['createdAt', 'DESC']],
      },
    );
  }

  /**
   * @param {object} order
   * @param {Array} orderWorks
   * @param {number} userId
   */
  async generate(order, orderWorks, userId) {
    if (!this.gdriveService) {
      throw new Error('GDrive service is not configured');
    }

    const buffer = await excelGenerationService.generateSmetaFromOrder(order, orderWorks);
    const fileName = `Смета_${order.name || order.id}`;
    const driveFile = await this.gdriveService.uploadExcel(userId, buffer, fileName);

    return this.create({
      orderId: order.id,
      name: driveFile.name,
      weblink: driveFile.webViewLink,
      gdriveFileId: driveFile.id,
      createdBy: userId,
    });
  }

  async remove(id, userId) {
    const savedFile = await this.getById(id);
    if (!savedFile) return 0;

    if (savedFile.gdriveFileId && this.gdriveService) {
      try {
        await this.gdriveService.deleteFile(userId, savedFile.gdriveFileId);
      } catch (error) {
        console.error('Error deleting file from Google Drive:', error.message);
      }
    }

    return this.delete(id);
  }
}

module.exports = SavedFileRepository;
