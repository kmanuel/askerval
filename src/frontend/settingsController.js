const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelectorAll('input[name=mood]').forEach(e => e.addEventListener('click', (evt) => {
        ipcRenderer.send(ipcConstants.RATING_NEW, evt.target.value);
    }));

    const show = function () {
        document.querySelectorAll('.toggle-view').forEach(v => v.style.display = 'none');
        document.querySelector('#settings-view').style.display = 'block';
    };

    return {show}
};

module.exports = {create};