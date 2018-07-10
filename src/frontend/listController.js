const electron = require('electron');
const ipcConstants = require('../shared/ipcConstants');
const {ipcRenderer} = electron;

const create = () => {
    const addListEntry = function (entry, options, prevAnswersEl) {
        const entryListItem = document.createElement('li');
        entryListItem.classList.add('row');

        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', options);
        const dateElement = document.createElement('span');
        dateElement.innerText = formattedDate;
        dateElement.classList.add('col', 's6');

        const valueElement = document.createElement('span');
        valueElement.innerText = entry.value;
        valueElement.classList.add('col', 's3');

        entryListItem.appendChild(dateElement);
        entryListItem.appendChild(valueElement);

        if (entry.screenshots) {
            const screenshotsElement = document.createElement('span');
            screenshotsElement.classList.add('screenshots-container');

            entry.screenshots.forEach(shot => {
                const screenshotLink = document.createElement('a');
                screenshotLink.classList.add('secondary-content');

                screenshotLink.addEventListener('click', () => {
                    ipcRenderer.send(ipcConstants.SCREENSHOT_SHOW, shot);
                });
                const icon = document.createElement("i");
                icon.classList.add('material-icons', 'screenshot-icon');
                icon.textContent = 'image';
                screenshotLink.appendChild(icon);

                screenshotsElement.appendChild(screenshotLink);
            });

            entryListItem.appendChild(screenshotsElement);
        }

        entryListItem.classList.add('collection-item');
        prevAnswersEl.appendChild(entryListItem);
    };

    const updateList = (ratings) => {
        const prevAnswersEl = document.querySelector('#prev-ratings');

        prevAnswersEl.querySelectorAll('.collection-item').forEach(item => {
            item.parentNode.removeChild(item);
        });

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
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.toggle-view').forEach(view => view.style.display= 'none');
        document.querySelector('#list-nav').classList.add('active');
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