const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const ratingControllerFactory = require('./ratingController');
const listControllerFactory = require('./listController');
const settingsControllerFactory = require('./settingsController');

const ratingController = ratingControllerFactory.create();
const listController = listControllerFactory.create();
const settingsController = settingsControllerFactory.create();

document.querySelector('#rate-view-btn').addEventListener('click', ratingController.show);
document.querySelector('#history-view-btn').addEventListener('click', listController.show);
document.querySelector('#settings-view-btn').addEventListener('click', settingsController.show);

ipcRenderer.send(ipcConstants.SETTINGS_LOAD, {});

ipcRenderer.on(ipcConstants.SETTINGS_LOAD_RESPONSE, (event, settings) => {
    const {question, interval} = settings;
    if (question) {
        window.question = question;
        document.querySelector('#rating-question').innerText = question;
        document.querySelector('#question').value = question;
    }
    if (interval) {
        document.querySelector('#ask-interval').value = parseInt(interval);
    }
});

