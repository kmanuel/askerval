const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    const show = function () {
        console.log('showing settings view');
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.toggle-view').forEach(view => view.style.display= 'none');
        document.querySelector('#settings-nav').classList.add('active');
        document.querySelector('#settings-view').style.display = 'block';
    };

    return {show}
};

module.exports = {create};