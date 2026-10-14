const { loadEnv } = require('./common/config/env');

loadEnv();

const Sentry = require('@sentry/electron/main');

Sentry.init({
  dsn: 'https://00d0ca6f524459de13ccdca243aead1a@o4504847855386624.ingest.us.sentry.io/4512254078353409',
  environment: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
  integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],
});

Sentry.setTag('process', 'main');


const { app, BrowserWindow, ipcMain } = require('electron');

ipcMain.on('sentry:renderer-error', (_event, payload) => {
  const message = typeof payload?.message === 'string' ? payload.message : 'Unknown renderer error';
  const error = new Error(message);

  if (typeof payload?.stack === 'string') error.stack = payload.stack;

  Sentry.withScope((scope) => {
    scope.setTag('process', 'splash-renderer');
    Sentry.captureException(error);
  });
});

const path = require('path');

const createWindow = require('./infrastructure/ipcHandlers/mainWindow.handler');

const setIpcHandlers = require('./infrastructure/ipcHandlers/setIpc.handler');



// Squirrel: install/uninstall запускает exe с --squirrel-* — не открываем UI

if (require('electron-squirrel-startup')) {

  app.quit();

} else {

  if (process.env.NODE_ENV === 'dev' && !app.isPackaged) {

    require('electron-reload')(path.join(__dirname, '../'), {

      electron: require(`${__dirname}/../node_modules/electron`),

    });

  }



  app.whenReady().then(async () => {

    const { getDbHandler } = require('./infrastructure/ipcHandlers/db.handler');



    const connected = await getDbHandler().getDbConnection();

    if (!connected) {

      console.error('Не удалось подключиться к SQLite');

    }



    setIpcHandlers();

    await createWindow();

    app.on('activate', () => {

      if (BrowserWindow.getAllWindows().length === 0) createWindow();

    });

  });



  app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') app.quit();

  });

}

