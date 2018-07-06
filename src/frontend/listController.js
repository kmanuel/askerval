const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    const addMoodListEntry = function (mood, options, prevMoodsEl) {
        const moodLi = document.createElement('li');
        const formattedDate = new Date(mood.date).toLocaleDateString('en-US', options);
        const text = document.createTextNode(`${formattedDate}: ${mood.rating}`);

        moodLi.appendChild(text);
        prevMoodsEl.appendChild(moodLi);
    };

    const updateMoodList = (moods) => {
        const prevMoodsEl = document.querySelector('#prev-moods');
        prevMoodsEl.innerHTML = '';

        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        moods.forEach(mood => {
            addMoodListEntry(mood, options, prevMoodsEl);
        })
    };

    ipcRenderer.on(ipcConstants.ENTRIES_LOAD_RESPONSE, (evt, moods) => {
        updateMoodList(moods);
    });

    const switchToHistoryView = () => {
        document.querySelector('#rate-view').style.display = 'none';
        document.querySelector('#history-view').style.display = 'block';
    };

    const requestList = () => {
        ipcRenderer.send(ipcConstants.ENTRIES_LOAD_REQUEST);
    };

    const show = () => {
        requestList();
        switchToHistoryView();
    };

    return {
        show
    }
};

module.exports = {create};