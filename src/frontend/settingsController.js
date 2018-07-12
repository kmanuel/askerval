const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelector('#settings-form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        const formElements = [...evt.target.elements];

        formElements.forEach(el => console.log(el.tagName));

        const questionInputElement = evt.target.querySelector('[name=\'question-input\']');
        const intervalInputElement = evt.target.querySelector('[name=\'interval-input\']');

        const settings = {
            "question": questionInputElement.value,
            "interval": intervalInputElement.value,
        };

        ipcRenderer.send(ipcConstants.SETTINGS_CHANGE, settings);
    });


    const show = function () {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.toggle-view').forEach(view => view.style.display = 'none');
        document.querySelector('#settings-nav').classList.add('active');
        document.querySelector('#settings-view').style.display = 'block';
    };

    const setSettings = (settings) => {
        document.querySelector('#question-settings').value = settings.question;
        document.querySelector('#interval-settings').value = parseInt(settings.interval);
    };

    return {
        show,
        setSettings
    };
};

module.exports = {create};