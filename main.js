//noinspection NodeJsCodingAssistanceForCoreModules
const path = require('path');
const electron = require('electron');
const Datastore = require('nedb');

const ipcConstants = require('./src/shared/ipcConstants');

const db = new Datastore();

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

const {app, BrowserWindow, Tray, ipcMain} = require('electron');

let mainWindow, askingTimer;
let askingTimeout = ONE_HOUR;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 275,
        height: 325,
        show: false,
        frame: false,
        resizable: false,
        webPreferences: {backgroundThrottling: false}
    });
    mainWindow.loadFile('index.html');
    mainWindow.hide();
}

function toggleWindowVisibility() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
    }
}

let createTray = function () {
    const iconPath = path.join(__dirname, `./src/assets/question_mark.jpeg`);
    const tray = new Tray(iconPath);
    tray.setToolTip('Don\'t call me. I\'ll call you!');
    tray.on('click', toggleWindowVisibility);
    tray.on('right-click', () => console.log('right-glick'));
};

let startAskingTimer = function () {
    askingTimer = setInterval(() => {
        mainWindow.show();
    }, askingTimeout);
};

function init() {
    createMainWindow();
    createTray();
    startAskingTimer();
}

let createApp = function () {
    app.on('ready', init);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (mainWindow === null) {
            init();
        }
    });
};


const addIpcListeners = function () {
    ipcMain.on(ipcConstants.RATING_NEW, (event, rating) => {
        const entry = {...rating, date: new Date()};
        db.insert({
            entry
        }, (err) => {
            if (err) {
                console.log('error inserting rating', err);
            }
            mainWindow.hide();
        });
    });

    ipcMain.on(ipcConstants.ENTRIES_LOAD_REQUEST, () => {
        db.find({}, (err, docs) => {
            if (err) {
                console.log('error loading moods', err);
            } else {
                mainWindow.webContents.send(ipcConstants.ENTRIES_LOAD_RESPONSE, docs);
            }
        });
    });
};

createApp();
addIpcListeners();