const GoogleDriveClient = require('./googleDrive.service');
const GoogleOAuthService = require('./oauth.service');

const APP_FOLDER_NAME = 'Smeta';

class GdriveService {
  /**
   * @param {import('../repositories/sql/gdriveConnection.repository')} gdriveConnectionRepository
   * @param {import('../repositories/sql/oauthToken.repository')} oauthTokenRepository
   */
  constructor(gdriveConnectionRepository, oauthTokenRepository) {
    this.gdriveConnectionRepository = gdriveConnectionRepository;
    this.oauthTokenRepository = oauthTokenRepository;
    this.oauthService = new GoogleOAuthService(oauthTokenRepository, gdriveConnectionRepository);
  }

  async getStatus(userId) {
    const connection = await this.gdriveConnectionRepository.getByUserId(userId);
    if (!connection) {
      return { connected: false };
    }

    return {
      connected: true,
      email: connection.email,
      defaultFolder: connection.defaultFolder,
    };
  }

  async connect(userId) {
    return this.oauthService.connect(userId);
  }

  async disconnect(userId) {
    await this.oauthTokenRepository?.deleteByUserId(userId);
    await this.gdriveConnectionRepository.deleteByUserId(userId);
    return { success: true };
  }

  async setDefaultFolder(userId, defaultFolder) {
    const trimmed = String(defaultFolder || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Укажи ID папки' };
    }

    const { client } = await this._createDriveClient(userId);
    const exists = await client.folderExists(trimmed);
    if (!exists) {
      return {
        success: false,
        error:
          'Папка недоступна. С scope drive.file можно использовать только папки, созданные приложением. Оставь поле пустым — будет использована папка Smeta.',
      };
    }

    const connection = await this.gdriveConnectionRepository.updateDefaultFolder(userId, trimmed);
    if (!connection) {
      return { success: false, error: 'Google Drive не подключён' };
    }
    return { success: true, defaultFolder: connection.defaultFolder };
  }

  async _createDriveClient(userId) {
    const connection = await this.gdriveConnectionRepository.getByUserId(userId);
    if (!connection) {
      throw new Error('Google Drive не подключён');
    }

    const oauth2Client = this.oauthService.createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: connection.access,
      refresh_token: connection.refresh,
    });

    oauth2Client.on('tokens', async (tokens) => {
      await this.gdriveConnectionRepository.updateTokens(userId, tokens);
    });

    return {
      client: new GoogleDriveClient(oauth2Client),
      defaultFolder: connection.defaultFolder,
    };
  }

  async _ensureAppFolder(userId, client) {
    const connection = await this.gdriveConnectionRepository.getByUserId(userId);
    if (connection?.defaultFolder) {
      const exists = await client.folderExists(connection.defaultFolder);
      if (exists) {
        return connection.defaultFolder;
      }
    }

    const folder = await client.createFolder(APP_FOLDER_NAME);
    await this.gdriveConnectionRepository.updateDefaultFolder(userId, folder.id);
    return folder.id;
  }

  _formatUploadError(error) {
    const message = error?.message || 'Неизвестная ошибка';

    if (message.includes('Insufficient Permission') || error?.code === 403) {
      return (
        'Нет прав на загрузку в Google Drive. Отключи и подключи GDrive заново в настройках ' +
        '(будет создана папка Smeta). Не указывай чужой ID папки вручную.'
      );
    }

    if (message.includes('invalid_grant')) {
      return 'Сессия Google Drive истекла. Подключи Google Drive заново.';
    }

    return message;
  }

  async uploadExcel(userId, buffer, fileName) {
    try {
      const { client, defaultFolder } = await this._createDriveClient(userId);
      const folderId = defaultFolder || (await this._ensureAppFolder(userId, client));
      return await client.createExcelFileWithFallback(buffer, fileName, folderId);
    } catch (error) {
      console.error('[GDrive] uploadExcel error:', error);
      throw new Error(this._formatUploadError(error));
    }
  }

  async deleteFile(userId, fileId) {
    const { client } = await this._createDriveClient(userId);
    return client.deleteExcelFile(fileId);
  }
}

module.exports = GdriveService;
