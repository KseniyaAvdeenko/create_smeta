const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("electron", {
    screen: ()=> ipcRenderer.invoke('screen'),
    dark: () => ipcRenderer.invoke('mode:dark'),
    light: () => ipcRenderer.invoke('mode:light'),
    initial: () => ipcRenderer.invoke('mode:initial'),
    isOnline: () => ipcRenderer.invoke('connected'),
    dbConnection: () => ipcRenderer.invoke('db:connection'),
    getAllMeasurements: () => ipcRenderer.invoke('measurements:getAll'),
    getByIdMeasurement: (id) => ipcRenderer.invoke('measurements:getById', id),
    createMeasurement: (data) => ipcRenderer.invoke('measurements:create', data),
    deleteMeasurement: (id) => ipcRenderer.invoke('measurements:delete', id),
    getAllWorkCategories: () => ipcRenderer.invoke('workCategory:getAll'),
    getByIdWorkCategories: (id) => ipcRenderer.invoke('workCategory:getById', id),
    createWorkCategories: (data) => ipcRenderer.invoke('workCategory:create', data),
    updateWorkCategories: (id, data) => ipcRenderer.invoke('workCategory:update',id, data),
    deleteWorkCategories: (id) => ipcRenderer.invoke('workCategory:delete', id),
});


