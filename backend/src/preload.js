const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("electron", {
    screen: ()=> ipcRenderer.invoke('screen'),
    dark: () => ipcRenderer.invoke('mode:dark'),
    light: () => ipcRenderer.invoke('mode:light'),
    initial: () => ipcRenderer.invoke('mode:initial'),
    isOnline: () => ipcRenderer.invoke('connected'),
    sqlDbConnection: () => ipcRenderer.invoke('sqlDb:connection'),
});


