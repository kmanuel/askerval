const electron = require('electron');
const ratingControllerFactory = require('./ratingController');
const listControllerFactory = require('./listController');

const ratingController = ratingControllerFactory.create();
const listController = listControllerFactory.create();

document.querySelector('#rate-nav').addEventListener('click', ratingController.show);
document.querySelector('#list-nav').addEventListener('click', listController.show);