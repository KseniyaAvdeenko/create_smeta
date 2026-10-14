const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');
const { shell } = require('electron');
const googleConfig = require('../../common/config/google.config');
const GoogleDriveClient = require('./googleDrive.service');

const APP_FOLDER_NAME = 'Smeta';

class GoogleOAuthService {
  /**
   * @param {import('../repositories/sql/oauthToken.repository')} oauthTokenRepository
   * @param {import('../repositories/sql/gdriveConnection.repository')} gdriveConnectionRepository
   */
  constructor(oauthTokenRepository, gdriveConnectionRepository) {
    this.oauthTokenRepository = oauthTokenRepository;
    this.gdriveConnectionRepository = gdriveConnectionRepository;
    this.activeServer = null;
  }

  createOAuth2Client() {
    const { clientId, clientSecret, redirectUri } = googleConfig.oauth;

    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_OAUTH_CLIENT_ID и GOOGLE_OAUTH_CLIENT_SECRET не заданы в .env');
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  _closeActiveServer() {
    if (this.activeServer) {
      this.activeServer.close();
      this.activeServer = null;
    }
  }

  /**
   * @param {number} userId
   * @returns {Promise<{ success: boolean, email?: string, error?: string }>}
   */
  async connect(userId) {
    this._closeActiveServer();

    const state = await this.oauthTokenRepository.createState(userId);
    const oauth2Client = this.createOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: googleConfig.oauth.scopes,
      state,
    });

    const redirectUri = new URL(googleConfig.oauth.redirectUri);
    const port = Number(redirectUri.port) || 3847;
    const pathname = redirectUri.pathname || '/oauth/callback';

    return new Promise((resolve) => {
      const server = http.createServer(async (req, res) => {
        try {
          const requestUrl = new URL(req.url, googleConfig.oauth.redirectUri);

          if (requestUrl.pathname !== pathname) {
            res.writeHead(404);
            res.end();
            return;
          }

          const error = requestUrl.searchParams.get('error');
          if (error) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<html><body><h1>Ошибка авторизации Google</h1></body></html>');
            this._closeActiveServer();
            resolve({ success: false, error });
            return;
          }

          const code = requestUrl.searchParams.get('code');
          const returnedState = requestUrl.searchParams.get('state');
          const stateRecord = await this.oauthTokenRepository.findByToken(returnedState);

          if (!code || !stateRecord || stateRecord.userId !== userId) {
            throw new Error('Некорректный OAuth callback');
          }

          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
          const { data: userInfo } = await oauth2.userinfo.get();

          if (!tokens.refresh_token) {
            throw new Error('Google не вернул refresh_token. Повторите подключение.');
          }

          await this.gdriveConnectionRepository.upsertForUser(userId, {
            access: tokens.access_token,
            refresh: tokens.refresh_token,
            email: userInfo.email,
          });

          try {
            const driveClient = new GoogleDriveClient(oauth2Client);
            const folder = await driveClient.createFolder(APP_FOLDER_NAME);
            await this.gdriveConnectionRepository.updateDefaultFolder(userId, folder.id);
          } catch (folderError) {
            console.error('Failed to create default Smeta folder:', folderError.message);
          }

          await this.oauthTokenRepository.deleteByToken(returnedState);

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(
            '<html><body><h1>Google Drive подключён</h1><p>Можно закрыть это окно.</p></body></html>',
          );
          this._closeActiveServer();
          resolve({ success: true, email: userInfo.email });
        } catch (err) {
          console.error('OAuth callback error:', err);
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<html><body><h1>Ошибка подключения</h1></body></html>');
          this._closeActiveServer();
          resolve({ success: false, error: err.message });
        }
      });

      server.on('error', (err) => {
        console.error('OAuth server error:', err);
        this._closeActiveServer();
        resolve({ success: false, error: err.message });
      });

      this.activeServer = server;
      server.listen(port, '127.0.0.1', () => {
        shell.openExternal(authUrl);
      });
    });
  }
}

module.exports = GoogleOAuthService;
