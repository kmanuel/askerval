const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelector('#save-btn').addEventListener('click', () => {
        const settings = {
            question: document.querySelector('input#question').value,
            interval: document.querySelector('input#ask-interval').value
        };

        ipcRenderer.send(ipcConstants.SETTINGS_CHANGE, settings);
    });

    const show = function () {
        document.querySelectorAll('.toggle-view').forEach(v => v.style.display = 'none');
        document.querySelector('#settings-view').style.display = 'block';
    };

    return {show}
};

module.exports = {create};