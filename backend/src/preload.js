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
    updateMeasurements: (id, data) => ipcRenderer.invoke('measurements:update', id, data),
    deleteMeasurements: (id) => ipcRenderer.invoke('measurements:delete', id),
});


