const { google } = require('googleapis');
const { Readable } = require('stream');
const Sentry = require('@sentry/electron/main');

class GoogleDriveClient {
  /**
   * @param {import('google-auth-library').OAuth2Client} oauth2Client
   */
  constructor(oauth2Client) {
    this.oauth2Client = oauth2Client;
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  _bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  _isPermissionError(error) {
    const message = error?.message || '';
    const code = error?.code || error?.response?.status;
    return (
      code === 403 ||
      message.includes('Insufficient Permission') ||
      message.includes('insufficientPermissions')
    );
  }

  async createFolder(folderName, parentFolderId = null) {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

    const response = await this.drive.files.create({
      resource: fileMetadata,
      fields: 'id,name',
      supportsAllDrives: true,
    });

    return response.data;
  }

  async folderExists(folderId) {
    if (!folderId) return false;
    try {
      await this.drive.files.get({
        fileId: folderId,
        fields: 'id,name,trashed',
        supportsAllDrives: true,
      });
      return true;
    } catch (error) {
      if (this._isPermissionError(error) || error?.code === 404) {
        return false;
      }
      throw error;
    }
  }

  async createExcelFile(fileBuffer, fileName, folderId = null) {
    const fileMetadata = {
      name: `${fileName}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const bufferData = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);

    const response = await this.drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: this._bufferToStream(bufferData),
      },
      fields: 'id,name,webViewLink,createdTime',
      supportsAllDrives: true,
    });

    return {
      id: response.data.id,
      name: response.data.name,
      webViewLink: response.data.webViewLink,
      createdTime: response.data.createdTime,
    };
  }

  async createExcelFileWithFallback(fileBuffer, fileName, folderId = null) {
    if (folderId) {
      try {
        return await this.createExcelFile(fileBuffer, fileName, folderId);
      } catch (error) {
        if (!this._isPermissionError(error)) {
          throw error;
        }
        Sentry.addBreadcrumb({
          category: 'gdrive',
          message: 'folder upload denied, fallback to Drive root',
          level: 'warning',
          data: {
            folderId,
            httpStatus: error?.code ?? error?.response?.status ?? null,
            reason: error?.errors?.[0]?.reason ?? null,
          },
        });
        console.warn(
          `[GDrive] Нет доступа к папке ${folderId}, загрузка в корень Drive:`,
          error.message,
        );
      }
    }

    return this.createExcelFile(fileBuffer, fileName, null);
  }

  async deleteExcelFile(fileId) {
    await this.drive.files.delete({
      fileId,
      supportsAllDrives: true,
    });
    return true;
  }
}

module.exports = GoogleDriveClient;
