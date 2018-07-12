const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelector('#settings-form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        const formElements = [...evt.target.elements];

        formElements.forEach(el => console.log(el.tagName));

        const settings = formElements
            .filter(el => el.tagName === 'INPUT')
            .map(el => {
                return {
                    "name": el.name, "value": el.value
                }
            });

        ipcRenderer.send(ipcConstants.SETTINGS_CHANGE, settings);
    });


    const show = function () {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.toggle-view').forEach(view => view.style.display = 'none');
        document.querySelector('#settings-nav').classList.add('active');
        document.querySelector('#settings-view').style.display = 'block';
    };

    return {show}
};

module.exports = {create};