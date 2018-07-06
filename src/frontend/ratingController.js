const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelectorAll('input[name=mood]').forEach(e => e.addEventListener('click', (evt) => {
        ipcRenderer.send(ipcConstants.RATING_NEW, evt.target.value);
    }));

    const show = function () {
        document.querySelector('#rate-view').style.display = 'block';
        document.querySelector('#history-view').style.display = 'none';
    };

    return {
        show
    }
};

module.exports = {create};