const { BrowserWindow, Menu, screen } = require('electron');
const path = require('node:path');
const isOnline = require('@esm2cjs/is-online').default;
const { getDbHandler } = require('./db.handler');

async function createMainWindow() {
  const isDev = process.env.NODE_ENV === 'dev';
  const srcRoot = path.join(__dirname, '../..');

  if (isDev) {
    const { session } = require('electron');
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const responseHeaders = { ...details.responseHeaders };
      delete responseHeaders['content-security-policy'];
      callback({ responseHeaders });
    });
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    width: width - 20,
    title: 'Smeta Generation',
    height: height - 20,
    show: false,
    resizable: true,
    transparent: true,
    hasShadow: true,
    roundedCorners: true,
    webPreferences: {
      preload: path.join(srcRoot, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
      webSecurity: true,
    },
  });

  const preloading = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    show: true,
    parent: mainWindow,
    title: 'Smeta Generation',
    autoHideMenuBar: true,
    skipTaskbar: true,
    backgroundColor: '#000000',
    hasShadow: true,
    roundedCorners: true,
    frame: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(srcRoot, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    },
  });

  preloading.loadFile(path.join(srcRoot, 'index.html'));
  preloading.center();

  if (isDev) {
    const http = require('http');
    const checkDevServer = () =>
      new Promise((resolve) => {
        const req = http.get('http://localhost:5173', () => resolve(true));
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => {
          req.destroy();
          resolve(false);
        });
      });

    const serverAvailable = await checkDevServer();
    if (serverAvailable) {
      await mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    } else {
      await mainWindow.loadFile(path.join(srcRoot, 'build/index.html'));
      mainWindow.webContents.openDevTools();
    }
  } else {
    await mainWindow.loadFile(path.join(srcRoot, 'build/index.html'));
  }

  Menu.setApplicationMenu(null);

  const openMainWindow = () => {
    if (!preloading.isDestroyed()) preloading.close();
    mainWindow.show();
  };

  const dbConnection = await getDbHandler().getDbConnection();
  const online = await isOnline();

  setTimeout(openMainWindow, online && dbConnection ? 1000 : 1000);
}

module.exports = createMainWindow;
