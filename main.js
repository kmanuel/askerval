//noinspection NodeJsCodingAssistanceForCoreModules
const path = require('path');
const electron = require('electron');
const Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data/nedb/ratings.db',
        autoload: true
    });

const ipcConstants = require('./src/shared/ipcConstants');
const screenCapturer = require('./src/backend/screenCapturer').create();

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

const {app, BrowserWindow, Tray, ipcMain} = require('electron');

let mainWindow, askingTimer;
let askingTimeout = ONE_HOUR;

function ScreenshotWindow(screenshotPath) {
    const screenshotWindow = new BrowserWindow({
        width: 600,
        height: 400,
        show: true,
    });
    screenshotWindow.loadFile(screenshotPath);
    screenshotWindow.setMenu(null);
    return screenshotWindow;
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
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
        mainWindow.hide();
        screenCapturer.capture()
            .then((filenames) => {
                const entry = {...rating, date: new Date(), screenshots: filenames};
                console.log('inserting entry', entry);
                db.insert({
                    entry
                }, (err) => {
                    if (err) {
                        console.log('error inserting rating', err);
                    }
                });
            })
            .catch(err => {
                console.log('error capturing screen', err);
            });
    });

    ipcMain.on(ipcConstants.ENTRIES_LOAD_REQUEST, () => {
        db.find({}).sort({'entry.date': -1}).exec((err, docs) => {
            if (err) {
                console.log('error loading moods', err);
            } else {
                mainWindow.webContents.send(ipcConstants.ENTRIES_LOAD_RESPONSE, docs);
            }
        });
    });

    ipcMain.on(ipcConstants.SCREENSHOT_SHOW, (evt, filename) => {
        new ScreenshotWindow(filename);
    });

    ipcMain.on(ipcConstants.SETTINGS_CHANGE, (evt, settings) => {
        console.log('received settings change', settings);
    });


};

createApp();
addIpcListeners();