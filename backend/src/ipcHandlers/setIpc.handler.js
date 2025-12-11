const {ipcMain, screen} = require("electron");
const ThemeModesHandler = require('./themModes.handler');
const isOnline = require("@esm2cjs/is-online").default;
const path = require("path");
const process = require("node:process");
const {app} = require('electron')
const DbHandler = require('../ipcHandlers/db.handler');

require('dotenv').config(
    {
        path: app.isPackaged
            ? path.join(process.resourcesPath, '.env')
            : path.join(process.cwd(), '.env')
    }
);

function setIpcHandlers() {
    //connection
    ipcMain.handle('connected', async (_) => await isOnline())

    //theme modes
    ipcMain.handle('mode:initial', ThemeModesHandler.getInitialThemeMode);
    ipcMain.handle('mode:dark', ThemeModesHandler.getDarkMode);
    ipcMain.handle('mode:light', ThemeModesHandler.getLightMode);
    //appSizes
    ipcMain.handle('screen', async (_) => await screen.getPrimaryDisplay().workAreaSize);

    // db handlers Postgres or firebase
    ipcMain.handle('db:connection', async (_) => await new DbHandler().getDbConnection());
}

module.exports = setIpcHandlers;