const {BrowserWindow, Menu, screen} = require("electron");
const path = require('node:path');
const isOnline = require("@esm2cjs/is-online").default;
const installExtension = require('electron-devtools-installer');
const DbHandler = require('./db.handler');

async function createMainWindow() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize;
    const mainWindow = new BrowserWindow({
        width: width - 20,
        title: 'Smeta Generation',
        height: height - 20,
        show: false,
        // show: true,
        resizable: true,
        transparent: true,
        //backgroundColor: "#000000",
        hasShadow: true,
        roundedCorners: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
        },
    });

    const preloading = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true,
        show: true,
        parent: mainWindow,
        title: 'Smeta Generation',
        autoHideMenuBar: true,
        // frame: false,
        // resizable: false,
        skipTaskbar: true,
        backgroundColor: "#000000",
        hasShadow: true,
        roundedCorners: true,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: false
        },
    })
    
    preloading.loadFile(path.join(__dirname, '../index.html'))
    preloading.center()


    const [disk, folder1, folder2, prodFolder] = path.join(__dirname, '').split('\\')
    const mainWindowPath = disk + '\\' + folder1 + '\\' + folder2 + '\\' + prodFolder + '\\' + 'client\\build\\index.html'
    mainWindow.loadURL(path.join(__dirname, '../build/index.html'));
    // mainWindow.center()
    // mainWindow
    mainWindow.setBackgroundMaterial('acrylic')

    Menu.setApplicationMenu(null);
    // Open the DevTools.
// mainWindow.webContents.openDevTools();
    //preloading.webContents.openDevTools();
    // -------------------------------------

    const openMainWindow = () => {
        if (!preloading.isDestroyed()) preloading.close();
        mainWindow.show();
      };
   
      const dbConnection = await new DbHandler().getDbConnection();
      
      await isOnline() && dbConnection
       ?setTimeout(openMainWindow, 5000) 
        :setTimeout(openMainWindow, 3000)
     
    // installExtension.default(installExtension.REDUX_DEVTOOLS)
    //     .then((name) => console.log(`Added Extension: ${name}`))
    //     .catch((err) => console.log('An error occurred:', err));

}

module.exports = createMainWindow;