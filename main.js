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
        width: 325,
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
};

let startAskingTimer = function () {
    askingTimer = setInterval(() => {
        mainWindow.show();
    }, askingTimeout);
};

const initDefaultDb = () => {
    db.insert({
        type: 'settings',
        setting: {
            question: 'How are you?',
            interval: 500
        }
    }, (err) => {
        if (err) {
            console.log('failed to init default db', err);
        }
    })
};

function init() {
    initDefaultDb();
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

const stopTimer = () => {
    clearInterval(askingTimer);
};

const restartTimer = () => {
    stopTimer();
    startAskingTimer();
};

const changeIntervalTo = (interval) => {
    askingTimeout = interval * ONE_SECOND;
    restartTimer();
};


const addIpcListeners = function () {
    ipcMain.on(ipcConstants.RATING_NEW, (event, rating) => {
        db.insert({
            rating,
            date: new Date()
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

    ipcMain.on(ipcConstants.SETTINGS_CHANGE, (event, settings) => {
        const {interval} = settings;

        db.insert({
            type: 'settings',
            setting: settings
        });

        // save to db
        // change interval if interval change
        // change question if question change
        // send  update to frontend if question change

        changeIntervalTo(interval);
    });

    ipcMain.on(ipcConstants.SETTINGS_LOAD, () => {
        db.findOne({
            type: 'settings'
        }, (err, doc) => {
            if (err) {
                console.log('error loading settings ', err);
            }
            if (!doc) {
                console.log('couldn\'t find settings in db');
                return;
            }
            const {setting} = doc;
            mainWindow.webContents.send(ipcConstants.SETTINGS_LOAD_RESPONSE, setting);
        })
    })
};

createApp();
addIpcListeners();