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
    //Measurements
    ipcMain.handle('measurements:getAll', async (_) => await new DbHandler().measurementRepository.getAll());
    ipcMain.handle('measurements:getById', async (_, id) => await new DbHandler().measurementRepository.getById(id));
    ipcMain.handle('measurements:create', async (_, measurementData) => await new DbHandler().measurementRepository.create(measurementData));
    ipcMain.handle('measurements:delete', async (_, id) => await new DbHandler().measurementRepository.delete(id));

    //WorkCategory
    ipcMain.handle('workCategory:getAll', async (_) => await new DbHandler().workCategoryRepository.getAll());
    ipcMain.handle('workCategory:getById', async (_, id) => await  new DbHandler().workCategoryRepository.getById(id));
    ipcMain.handle('workCategory:create', async (_, workCategoryData) => await  new DbHandler().workCategoryRepository.create(workCategoryData));
    ipcMain.handle('workCategory:update', async (_, id, updateData) => await  new DbHandler().workCategoryRepository.update(id, updateData));
    ipcMain.handle('workCategory:delete', async (_, id) => await  new DbHandler().workCategoryRepository.delete(id));

    //Works
    ipcMain.handle('works:getAll', async () => await new DbHandler(_).measurementRepository.getAll());
    ipcMain.handle('works:getById', async (_, id) => await  new DbHandler().workRepository.getById(id));
    ipcMain.handle('works:getByCategory', async (_, category) => await  new DbHandler().workRepository.findByCategory(category));
    ipcMain.handle('works:create', async (_, workData) => await  new DbHandler().workRepository.create(workData));
    ipcMain.handle('works:update', async (_, id, updateData) => await  new DbHandler().workRepository.update(id, updateData));
    ipcMain.handle('works:delete', async (_, id) => await  new DbHandler().workRepository.delete(id));

    //Orders
    ipcMain.handle('orders:getAll', async (_) => await new DbHandler().orderRepository.getAll());
    ipcMain.handle('orders:getByIdWithDetails', async (_, id) => await new DbHandler().orderRepository.getOrderWithDetails(id));
    ipcMain.handle('orders:create', async (_, orderData) => await new DbHandler().orderRepository.create(orderData));
    ipcMain.handle('orders:update', async (_, id, updateData) => await new DbHandler().orderRepository.update(id, updateData));
    ipcMain.handle('orders:delete', async (_, id) => await new DbHandler().orderRepository.delete(id));

    //OrderWorks
    ipcMain.handle('orderWorks:getAll', async (_) => await new DbHandler().orderWorkRepository.getAll());
    ipcMain.handle('orderWorks:getAllByOrderId', async (_, orderId) => await new DbHandler().orderWorkRepository.getByOrderId(orderId));
    ipcMain.handle('orderWorks:getById', async (_, id) => await new DbHandler().orderWorkRepository.getById(id));
    ipcMain.handle('orderWorks:create', async (_, orderWorkData) => await new DbHandler().orderWorkRepository.create(orderWorkData));
    ipcMain.handle('orderWorks:update', async (_, id, updateData) => await new DbHandler().orderWorkRepository.update(id, updateData));
    ipcMain.handle('orderWorks:delete', async (_, id) => await new DbHandler().orderWorkRepository.delete(id));

    //SavedFile
    ipcMain.handle('savedFile:getAll', async (_) => await new DbHandler().savedFileRepository.getAll());
    ipcMain.handle('savedFile:getByOrderId', async (_, orderId) => await new DbHandler().savedFileRepository.getByOrderId(orderId));
    //ipcMain.handle('savedFile:create', async (_, savedFile) => await new DbHandler().savedFileRepository.create(savedFile));
    //ipcMain.handle('savedFile:delete', async (_, id) => await  new DbHandler().savedFileRepository.delete(id));
}

module.exports = setIpcHandlers;