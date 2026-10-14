const { ipcMain, screen } = require('electron');
const ThemeModesHandler = require('../themModes.handler');
const isOnline = require('@esm2cjs/is-online').default;

function registerAppHandlers({ db }) {
  ipcMain.handle('connected', async () => await isOnline());
  ipcMain.handle('mode:initial', () => ThemeModesHandler.getInitialThemeMode());
  ipcMain.handle('mode:dark', () => ThemeModesHandler.getDarkMode());
  ipcMain.handle('mode:light', () => ThemeModesHandler.getLightMode());
  ipcMain.handle('screen', async () => await screen.getPrimaryDisplay().workAreaSize);
  ipcMain.handle('db:connection', async () => await db.getDbConnection());
}

module.exports = registerAppHandlers;
