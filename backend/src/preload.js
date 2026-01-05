const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("electron", {
    screen: ()=> ipcRenderer.invoke('screen'),
    dark: () => ipcRenderer.invoke('mode:dark'),
    light: () => ipcRenderer.invoke('mode:light'),
    initial: () => ipcRenderer.invoke('mode:initial'),
    isOnline: () => ipcRenderer.invoke('connected'),
    dbConnection: () => ipcRenderer.invoke('db:connection'),
    getAllMeasurements: () => ipcRenderer.invoke('measurements:getAll'),
    getMeasurementById: (id) => ipcRenderer.invoke('measurements:getById', id),
    createMeasurement: (data) => ipcRenderer.invoke('measurements:create', data),
    deleteMeasurement: (id) => ipcRenderer.invoke('measurements:delete', id),

    getAllWorkCategories: () => ipcRenderer.invoke('workCategory:getAll'),
    getWorkCategoryById: (id) => ipcRenderer.invoke('workCategory:getById', id),
    createWorkCategory: (data) => ipcRenderer.invoke('workCategory:create', data),
    updateWorkCategory: (id, data) => ipcRenderer.invoke('workCategory:update',id, data),
    deleteWorkCategory: (id) => ipcRenderer.invoke('workCategory:delete', id),

    getAllWorks: () => ipcRenderer.invoke('works:getAll'),
    getWorkById: (id) => ipcRenderer.invoke('works:getById', id),
    getWorksByCategoriesId: (id) => ipcRenderer.invoke('works:getByCategory', id),
    createWork: (data) => ipcRenderer.invoke('works:create', data),
    updateWork: (id, data) => ipcRenderer.invoke('works:update',id, data),
    deleteWork: (id) => ipcRenderer.invoke('works:delete', id),

    getAllOrders: () => ipcRenderer.invoke('orders:getAll'),
    getOrderById: (id) => ipcRenderer.invoke('orders:getByIdWithDetails', id),
    createOrder: (data) => ipcRenderer.invoke('orders:create', data),
    updateOrder: (id, data) => ipcRenderer.invoke('orders:update',id, data),
    deleteOrder: (id) => ipcRenderer.invoke('orders:delete', id),
});


