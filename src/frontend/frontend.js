const electron = require('electron');
const ratingControllerFactory = require('./ratingController');
const listControllerFactory = require('./listController');

const ratingController = ratingControllerFactory.create();
const listController = listControllerFactory.create();

document.querySelector('#rate-view-btn').addEventListener('click', ratingController.show);
document.querySelector('#history-view-btn').addEventListener('click', listController.show);