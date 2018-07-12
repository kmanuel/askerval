const electron = require('electron');
const ratingControllerFactory = require('./ratingController');
const listControllerFactory = require('./listController');
const settingsControllerFactory = require('./settingsController');

const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const ratingController = ratingControllerFactory.create();
const listController = listControllerFactory.create();
const settingsController = settingsControllerFactory.create();

document.querySelector('#rate-nav').addEventListener('click', ratingController.show);
document.querySelector('#list-nav').addEventListener('click', listController.show);
document.querySelector('#settings-nav').addEventListener('click', settingsController.show);

ipcRenderer.send(ipcConstants.SETTINGS_LOAD);
ipcRenderer.on(ipcConstants.SETTINGS_ENTRIES, (evt, settings) => {

    ratingController.setQuestion(settings.question);
    settingsController.setSettings(settings);

});