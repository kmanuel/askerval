const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    const addListEntry = function (entry, options, prevAnswersEl) {
        const entryListItem = document.createElement('li');
        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', options);
        const text = document.createTextNode(`${formattedDate}: ${entry.value}`);

        let screenshotLink;
        if (entry.screenshot) {
            screenshotLink = document.createElement('a');
            screenshotLink.addEventListener('click', (evt) => {
                ipcRenderer.send(ipcConstants.SCREENSHOT_SHOW, entry.screenshot);
            });
            screenshotLink.appendChild(text);


            entryListItem.appendChild(screenshotLink);
        } else {
            entryListItem.appendChild(text);
        }
        prevAnswersEl.appendChild(entryListItem);
    };

    const updateList = (ratings) => {
        const prevAnswersEl = document.querySelector('#prev-ratings');
        prevAnswersEl.innerHTML = '';

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        ratings
            .map(rating => rating.entry)
            .forEach(entry => {
            addListEntry(entry, options, prevAnswersEl);
        })
    };

    ipcRenderer.on(ipcConstants.ENTRIES_LOAD_RESPONSE, (evt, ratings) => {
        updateList(ratings);
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

    return {show}
};

module.exports = {create};