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
        screenCapturer.capture()
            .then((filename) => {
                const entry = {...rating, date: new Date(), screenshot: filename};
                db.insert({
                    entry
                }, (err) => {
                    if (err) {
                        console.log('error inserting rating', err);
                    }
                    mainWindow.hide();
                });
            })
            .catch(err => {
                console.log('error capturing screen', err);
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