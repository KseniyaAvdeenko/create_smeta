const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');

if (started) app.quit();

require('electron-reload')(path.join(__dirname, '../'), {
  electron: require(`${__dirname}/../node_modules/electron`),
});


app.whenReady().then(() => {
    createWindow();
    setIpcHandlers();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
