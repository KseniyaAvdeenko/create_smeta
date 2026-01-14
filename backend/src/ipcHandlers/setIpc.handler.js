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
    ipcMain.handle('mode:initial', () => ThemeModesHandler.getInitialThemeMode());
    ipcMain.handle('mode:dark', () => ThemeModesHandler.getDarkMode());
    ipcMain.handle('mode:light', () => ThemeModesHandler.getLightMode());
    //appSizes
    ipcMain.handle('screen', async (_) => await screen.getPrimaryDisplay().workAreaSize);

    // db handlers Postgres or firebase

    ipcMain.handle('db:connection', async (_) => await new DbHandler().getDbConnection());
    //Measurements
    const measurementRepo = new DbHandler().measurementRepository()
    ipcMain.handle('measurements:getAll', async (_) => await measurementRepo.getAll());
    ipcMain.handle('measurements:getById', async (_, id) => await measurementRepo.getById(id));
    ipcMain.handle('measurements:create', async (_, measurementData) => await measurementRepo.create(measurementData));
    ipcMain.handle('measurements:delete', async (_, id) => await measurementRepo.delete(id));

    //WorkCategory
    const workCategoryRepo = new DbHandler().workCategoryRepository()
    ipcMain.handle('workCategory:getAll', async (_) => await workCategoryRepo.getAll());
    ipcMain.handle('workCategory:getById', async (_, id) => await workCategoryRepo.getById(id));
    ipcMain.handle('workCategory:create', async (_, workCategoryData) => await workCategoryRepo.create(workCategoryData));
    ipcMain.handle('workCategory:update', async (_, id, updateData) => await workCategoryRepo.update(id, updateData));
    ipcMain.handle('workCategory:delete', async (_, id) => await workCategoryRepo.delete(id));

    //Works
    const worksRepo = new DbHandler().workRepository()
    ipcMain.handle('works:getAll', async () => await worksRepo.getAll());
    ipcMain.handle('works:getById', async (_, id) => await worksRepo.getById(id));
    ipcMain.handle('works:getByCategory', async (_, category) => await worksRepo.findByCategory(category));
    ipcMain.handle('works:create', async (_, workData) => await worksRepo.create(workData));
    ipcMain.handle('works:update', async (_, id, updateData) => await worksRepo.update(id, updateData));
    ipcMain.handle('works:delete', async (_, id) => await worksRepo.delete(id));

    //Estimates
    const orderRepo = new DbHandler().orderRepository()
    ipcMain.handle('orders:getAll', async (_) =>  await orderRepo.getAll())
    ipcMain.handle('orders:getByIdWithDetails', async (_, id) => await orderRepo.getOrderWithDetails(id));
    ipcMain.handle('orders:create', async (_, orderData) => await new orderRepo.create(orderData));
    ipcMain.handle('orders:update', async (_, id, updateData) => await orderRepo.update(id, updateData));
    ipcMain.handle('orders:delete', async (_, id) => await orderRepo.delete(id));

    //OrderWorks
    const orderWorksRepo = new DbHandler().orderWorkRepository()
    ipcMain.handle('orderWorks:getAll', async (_) => await orderWorksRepo.getAll());
    ipcMain.handle('orderWorks:getAllByOrderId', async (_, orderId) => await orderWorksRepo.getByOrderId(orderId));
    ipcMain.handle('orderWorks:getById', async (_, id) => await orderWorksRepo.getById(id));
    ipcMain.handle('orderWorks:create', async (_, orderWorkData) => await orderWorksRepo.create(orderWorkData));
    ipcMain.handle('orderWorks:update', async (_, id, updateData) => await orderWorksRepo.update(id, updateData));
    ipcMain.handle('orderWorks:delete', async (_, id) => await orderWorksRepo.delete(id));

    //SavedFile
    const savedFilesRepo = new DbHandler().savedFileRepository()
    ipcMain.handle('savedFile:getAll', async (_) => await savedFilesRepo.getAll());
    ipcMain.handle('savedFile:getByOrderId', async (_, orderId) => await savedFilesRepo.getByOrderId(orderId));
    ipcMain.handle('savedFile:getById', async (_, id) => await savedFilesRepo.getById(id));
    ipcMain.handle('savedFile:generate', async (_, order, orderWorks, folderId) => await savedFilesRepo.generate(order, orderWorks, folderId));
    ipcMain.handle('savedFile:remove', async (_, id) => await savedFilesRepo.remove(id));
}

module.exports = setIpcHandlers;