const electron = require('electron');
const Datastore = require('nedb');

const db = new Datastore();

const {app, BrowserWindow, ipcMain} = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

app.on('ready', createWindow);

app.on('mainWindowdow-all-closed', () => {
    if (process.platform !== 'darmainWindow') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
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