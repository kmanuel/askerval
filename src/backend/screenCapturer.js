//noinspection NodeJsCodingAssistanceForCoreModules
const fs = require('fs');
const screenshot = require('screenshot-desktop');

const create = () => {
    const capture = async() => {
        return new Promise((resolve, reject) => {
            screenshot()
                .then(buffer => {
                    const filename = `data/screenshots/shot_${new Date().getTime()}.jpg`;
                    fs.writeFile(filename, buffer, null, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(filename);
                        }
                    })
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    return { capture };
};

module.exports = { create };