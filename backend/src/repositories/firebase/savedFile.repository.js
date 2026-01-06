const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');
const excelGenerationService = require('../../services/excelGeneration.service');
const googleDriveService = require('../../services/googleDrive.service');

/**
 * smetaOrders / orderFiles
 * data: [ { id, orderId, name, date, ... } ]
 * item: {id: int, orderId: int, name: str, date:str, googleDriveId: str, webViewLink: str}
 */
class FirebaseSavedFileRepository extends FirebaseArrayDocRepository {
    constructor(db) {
        super(db, 'SmetaOrders', 'OrderFiles', 'id');
    }

    async getByOrderId(orderId) {
        const all = await this.getAll();
        return all.filter((f) => f.orderId === orderId);
    }

    /**
     * Генерирует Excel смету и сохраняет в Google Drive
     * @param {Object} order - данные заказа {id, name, clientName, ...}
     * @param {Array} orderWorks - работы заказа [{category, name, unit, quantity, price}]
     * @param {string} folderId - ID папки в Google Drive (опционально)
     * @returns {Promise<Object>} - {id, orderId, fileName, googleDriveId, webViewLink, date}
     */
    async generate(order, orderWorks, folderId = null) {
        // Генерируем Excel
        const buffer = await excelGenerationService.generateSmetaFromOrder(order, orderWorks);
        const fileName = `Смета_${order.name || order.id}`;

        // Загружаем в Google Drive
        const driveFile = await googleDriveService.createExcelFile(buffer, fileName, folderId);

        // Сохраняем запись в БД
        const savedFile = await this.create({
            orderId: order.id,
            fileName: driveFile.name,
            googleDriveId: driveFile.id,
            webViewLink: driveFile.webViewLink,
            date: new Date().toISOString()
        });

        return savedFile;
    }

    async remove(id) {
        try {
            const savedFile = await this.getById(id);
            if (!savedFile) return 0;

            if (savedFile.googleDriveId) {
                try {
                    await googleDriveService.deleteExcelFile(savedFile.googleDriveId);
                } catch (error) {
                    console.error('Error deleting file from Google Drive:', error);
                }
            }

            await this.delete(id);
            return 1
        } catch (e) {
            console.error(e)
            return 0
        }

    }
}

module.exports = FirebaseSavedFileRepository;


