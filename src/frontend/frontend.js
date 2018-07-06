const ratingControllerFactory = require('./ratingController');
const listControllerFactory = require('./listController');
const settingsControllerFactory = require('./settingsController');

const ratingController = ratingControllerFactory.create();
const listController = listControllerFactory.create();
const settingsController = settingsControllerFactory.create();

document.querySelector('#rate-view-btn').addEventListener('click', ratingController.show);
document.querySelector('#history-view-btn').addEventListener('click', listController.show);
document.querySelector('#settings-view-btn').addEventListener('click', settingsController.show);