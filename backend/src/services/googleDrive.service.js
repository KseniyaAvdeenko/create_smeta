const { google } = require('googleapis');
const { Readable } = require('stream');

class GoogleDriveService {
  constructor() {
    this.googleConfig = require('../config/google.config')
    this.drive = null;
    this.isAuthenticated = false;
  }

  /**
   * Инициализация Google Drive API с сервис аккаунтом
   */
  async initialize() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: this.googleConfig,
        scopes: ['https://www.googleapis.com/auth/drive.file']
      });

      this.drive = google.drive({ version: 'v3', auth });
      this.isAuthenticated = true;
      console.log('Google Drive API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      throw error;
    }
  }

  /**
   * Создание и загрузка Excel файла в Google Drive
   * @param {Buffer} fileBuffer - буфер с данными Excel файла
   * @param {string} fileName - имя файла (без расширения)
   * @param {string} folderId - ID папки в Google Drive (опционально)
   * @returns {Promise<Object>} - информация о созданном файле
   */
  /**
   * Конвертация Buffer в Readable stream
   */
  _bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async createExcelFile(fileBuffer, fileName, folderId = null) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      const fileMetadata = {
        name: `${fileName}.xlsx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };

      // Если указан folderId, добавляем его в метаданные
      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      // Конвертируем Buffer в stream для Google Drive API
      const bufferData = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
      
      const media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: this._bufferToStream(bufferData)
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,createdTime'
      });

      console.log(`Excel file "${fileName}.xlsx" created successfully in Google Drive`);
      return {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink,
        createdTime: response.data.createdTime
      };
    } catch (error) {
      console.error('Error creating Excel file:', error);
      throw error;
    }
  }

  /**
   * Загрузка существующего Excel файла (обновление содержимого)
   * @param {string} fileId - ID файла в Google Drive
   * @param {Buffer} fileBuffer - новые данные файла
   * @returns {Promise<Object>} - информация об обновленном файле
   */
  async updateExcelFile(fileId, fileBuffer) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      // Конвертируем Buffer в stream для Google Drive API
      const bufferData = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
      
      const media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: this._bufferToStream(bufferData)
      };

      const response = await this.drive.files.update({
        fileId: fileId,
        media: media,
        fields: 'id,name,webViewLink,modifiedTime'
      });

      console.log(`Excel file with ID "${fileId}" updated successfully`);
      return {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink,
        modifiedTime: response.data.modifiedTime
      };
    } catch (error) {
      console.error('Error updating Excel file:', error);
      throw error;
    }
  }

  /**
   * Удаление Excel файла из Google Drive
   * @param {string} fileId - ID файла для удаления
   * @returns {Promise<boolean>} - true если файл удален успешно
   */
  async deleteExcelFile(fileId) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      await this.drive.files.delete({
        fileId: fileId
      });

      console.log(`Excel file with ID "${fileId}" deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting Excel file:', error);
      throw error;
    }
  }

  /**
   * Получение информации о файле
   * @param {string} fileId - ID файла
   * @returns {Promise<Object>} - информация о файле
   */
  async getFileInfo(fileId) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,webViewLink,createdTime,modifiedTime,size'
      });

      return response.data;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  /**
   * Скачивание Excel файла
   * @param {string} fileId - ID файла для скачивания
   * @returns {Promise<Buffer>} - буфер с данными файла
   */
  async downloadExcelFile(fileId) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, {
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      throw error;
    }
  }

  /**
   * Создание папки в Google Drive
   * @param {string} folderName - имя папки
   * @param {string} parentFolderId - ID родительской папки (опционально)
   * @returns {Promise<string>} - ID созданной папки
   */
  async createFolder(folderName, parentFolderId = null) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
      }

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      });

      console.log(`Folder "${folderName}" created successfully`);
      return response.data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * Поиск файлов по имени
   * @param {string} fileName - имя файла для поиска
   * @returns {Promise<Array>} - массив найденных файлов
   */
  async findFilesByName(fileName) {
    if (!this.isAuthenticated) {
      await this.initialize();
    }

    try {
      const response = await this.drive.files.list({
        q: `name contains '${fileName}' and trashed = false`,
        fields: 'files(id,name,webViewLink,createdTime,modifiedTime)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error finding files:', error);
      throw error;
    }
  }
}

module.exports = new GoogleDriveService();
