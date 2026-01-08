const {BrowserWindow, Menu, screen} = require("electron");
const path = require('node:path');
const isOnline = require("@esm2cjs/is-online").default;
const installExtension = require('electron-devtools-installer');
const DbHandler = require('./db.handler');

async function createMainWindow() {
    const isDev = process.env.NODE_ENV === 'dev';

    // Подавляем CSP предупреждение в dev режиме
    if (isDev) {
        const {session} = require('electron');
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            const responseHeaders = {...details.responseHeaders};
            delete responseHeaders['content-security-policy'];
            callback({responseHeaders});
        });
    }

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
            webSecurity: true,
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
    console.log('isDev', isDev)
    if (isDev) {
        // Проверяем доступность Vite dev server
        const http = require('http');
        const checkDevServer = () => {
            return new Promise((resolve) => {
                const req = http.get('http://localhost:5173', (res) => {
                    resolve(true);
                });
                req.on('error', () => resolve(false));
                req.setTimeout(1000, () => {
                    req.destroy();
                    resolve(false);
                });
            });
        };

        const serverAvailable = await checkDevServer();
        if (serverAvailable) {
            console.log('serverAvailable', serverAvailable)
            await mainWindow.loadURL('http://localhost:5173');
            mainWindow.webContents.openDevTools();
        } else {
            console.warn('Vite dev server не запущен на порту 5173, загружаю build файл');
            mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
        }
    } else {
        mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    }
    // preloading.close();
    // mainWindow.center()
    // mainWindow.setBackgroundMaterial('acrylic')

    Menu.setApplicationMenu(null);
    // Open the DevTools.

    //preloading.webContents.openDevTools();
    // -------------------------------------

    const openMainWindow = () => {
        if (!preloading.isDestroyed()) preloading.close();
        mainWindow.show();
    };

    const dbConnection = await new DbHandler().getDbConnection();

    await isOnline() && dbConnection
        ? setTimeout(openMainWindow, 1000)
        : setTimeout(openMainWindow, 1000)

    // installExtension.default(installExtension.REDUX_DEVTOOLS)
    //     .then((name) => console.log(`Added Extension: ${name}`))
    //     .catch((err) => console.log('An error occurred:', err));

}

module.exports = createMainWindow;