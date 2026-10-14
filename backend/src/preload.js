const { contextBridge, ipcRenderer } = require('electron');

require('@sentry/electron/preload');

contextBridge.exposeInMainWorld('electron', {
  captureRendererError: (message, stack) =>
    ipcRenderer.send('sentry:renderer-error', { message, stack }),
  screen: () => ipcRenderer.invoke('screen'),
  dark: () => ipcRenderer.invoke('mode:dark'),
  light: () => ipcRenderer.invoke('mode:light'),
  initial: () => ipcRenderer.invoke('mode:initial'),
  isOnline: () => ipcRenderer.invoke('connected'),
  dbConnection: () => ipcRenderer.invoke('db:connection'),

  login: (login, password, rememberLogin) =>
    ipcRenderer.invoke('auth:login', { login, password, rememberLogin }),
  getRememberedLogin: () => ipcRenderer.invoke('auth:remembered-login'),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getCurrentUser: () => ipcRenderer.invoke('auth:me'),
  getProfile: () => ipcRenderer.invoke('auth:profile'),
  register: (userData) => ipcRenderer.invoke('auth:register', userData),
  hasUsers: () => ipcRenderer.invoke('auth:hasUsers'),

  getUserSettings: () => ipcRenderer.invoke('userSettings:get'),
  updateUserSettings: (data) => ipcRenderer.invoke('userSettings:update', data),

  getGdriveStatus: () => ipcRenderer.invoke('gdrive:status'),
  connectGdrive: () => ipcRenderer.invoke('gdrive:connect'),
  disconnectGdrive: () => ipcRenderer.invoke('gdrive:disconnect'),
  setGdriveDefaultFolder: (folderId) =>
    ipcRenderer.invoke('gdrive:setDefaultFolder', folderId),

  getAllMeasurements: () => ipcRenderer.invoke('measurements:getAll'),
  getMeasurementById: (id) => ipcRenderer.invoke('measurements:getById', id),
  createMeasurement: (data) => ipcRenderer.invoke('measurements:create', data),
  updateMeasurement: (id, data) => ipcRenderer.invoke('measurements:update', id, data),
  deleteMeasurement: (id) => ipcRenderer.invoke('measurements:delete', id),

  getAllWorkCategories: () => ipcRenderer.invoke('workCategory:getAll'),
  getWorkCategoryById: (id) => ipcRenderer.invoke('workCategory:getById', id),
  createWorkCategory: (data) => ipcRenderer.invoke('workCategory:create', data),
  updateWorkCategory: (id, data) => ipcRenderer.invoke('workCategory:update', id, data),
  deleteWorkCategory: (id) => ipcRenderer.invoke('workCategory:delete', id),

  getAllWorks: () => ipcRenderer.invoke('works:getAll'),
  getWorkById: (id) => ipcRenderer.invoke('works:getById', id),
  getWorksByCategoriesId: (id) => ipcRenderer.invoke('works:getByCategory', id),
  createWork: (data) => ipcRenderer.invoke('works:create', data),
  updateWork: (id, data) => ipcRenderer.invoke('works:update', id, data),
  deleteWork: (id) => ipcRenderer.invoke('works:delete', id),

  getWorkMeasurementsByWorkId: (workId) =>
    ipcRenderer.invoke('workMeasurements:getByWorkId', workId),
  createWorkMeasurement: (data) => ipcRenderer.invoke('workMeasurements:create', data),
  updateWorkMeasurement: (id, data) => ipcRenderer.invoke('workMeasurements:update', id, data),
  deleteWorkMeasurement: (id) => ipcRenderer.invoke('workMeasurements:delete', id),

  getAllOrders: () => ipcRenderer.invoke('orders:getAll'),
  getOrderById: (id) => ipcRenderer.invoke('orders:getByIdWithDetails', id),
  createOrder: (data) => ipcRenderer.invoke('orders:create', data),
  updateOrder: (id, data) => ipcRenderer.invoke('orders:update', id, data),
  deleteOrder: (id) => ipcRenderer.invoke('orders:delete', id),

  getAllOrderWorks: () => ipcRenderer.invoke('orderWorks:getAll'),
  getAllOrderWorksByOrderId: (orderId) =>
    ipcRenderer.invoke('orderWorks:getAllByOrderId', orderId),
  getOrderWorkById: (id) => ipcRenderer.invoke('orderWorks:getById', id),
  createOrderWork: (data) => ipcRenderer.invoke('orderWorks:create', data),
  updateOrderWork: (id, data) => ipcRenderer.invoke('orderWorks:update', id, data),
  deleteOrderWork: (id) => ipcRenderer.invoke('orderWorks:delete', id),

  getOrderWorkQuantitiesByOrderWorkId: (orderWorkId) =>
    ipcRenderer.invoke('orderWorkQuantity:getByOrderWorkId', orderWorkId),
  createOrderWorkQuantity: (data) => ipcRenderer.invoke('orderWorkQuantity:create', data),
  updateOrderWorkQuantity: (id, data) =>
    ipcRenderer.invoke('orderWorkQuantity:update', id, data),
  deleteOrderWorkQuantity: (id) => ipcRenderer.invoke('orderWorkQuantity:delete', id),

  getAllOrderFiles: () => ipcRenderer.invoke('savedFile:getAll'),
  getAllOrderFilesByOrderId: (orderId) => ipcRenderer.invoke('savedFile:getByOrderId', orderId),
  getOrderFileById: (id) => ipcRenderer.invoke('savedFile:getById', id),
  generateOrderFile: (order, orderWorks) => ipcRenderer.invoke('savedFile:generate', order, orderWorks),
  deleteOrderFile: (id) => ipcRenderer.invoke('savedFile:remove', id),
});
