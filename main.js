const path = require('path');
const electron = require('electron');
const Datastore = require('nedb');

const db = new Datastore();

const {app, BrowserWindow, Tray, ipcMain} = require('electron');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, show: false});
    mainWindow.loadFile('index.html');
    mainWindow.hide();
}

function init() {
    createMainWindow();

    const iconPath = path.join(__dirname, `./src/assets/question_mark.jpeg`);
    const tray = new Tray(iconPath);
    tray.setToolTip('Don\'t call me. I\'ll call you!');
    tray.on('click', () => mainWindow.show());
    tray.on('right-click', () => console.log('right-glick'));
}

app.on('ready', init);

app.on('mainWindowdow-all-closed', () => {
    if (process.platform !== 'darmainWindow') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        init();
    }
});

ipcMain.on('rating', (event, rating) => {
    db.insert({
        rating,
        date: new Date()
    }, (err, newDoc) => {
        if (err) {
            console.log('error inserting rating', err);
        } else {
            console.log('inserted new rating', newDoc);
        }
    });
});

ipcMain.on('mood:load-all', () => {
    db.find({}, (err, docs) => {
        if (err) {
            console.log('error loading moods');
        } else {
            mainWindow.webContents.send('mood:list', docs);
        }
    });
});