const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    document.querySelectorAll('input[name=rating]').forEach(e => e.addEventListener('click', (evt) => {
        const question = document.querySelector('#the-question').innerText;
        const value = evt.target.value;
        ipcRenderer.send(ipcConstants.RATING_NEW, {question, value});
    }));

    const show = function () {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.toggle-view').forEach(view => view.style.display= 'none');
        document.querySelector('#rate-nav').classList.add('active');
        document.querySelector('#rate-view').style.display = 'block';
    };

    const setQuestion = (question) => {
        document.querySelector('#the-question').innerText = question;
    };

    return {
        show,
        setQuestion
    };
};

module.exports = {create};