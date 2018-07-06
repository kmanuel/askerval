const electron = require('electron');
const Datastore = require('nedb');

const db = new Datastore();

const {app, BrowserWindow, ipcMain} = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
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