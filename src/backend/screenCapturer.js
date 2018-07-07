//noinspection NodeJsCodingAssistanceForCoreModules
const fs = require('fs');
const screenshot = require('screenshot-desktop');

const create = () => {
    const capture = async() => {
        return new Promise((resolve, reject) => {
            screenshot.all()
                .then(buffers => {
                    const filenames = [];

                    for (let i = 0; i < buffers.length; i++) {
                        const filename = `data/screenshots/shot${i}_${new Date().getTime()}.jpg`;
                        filenames.push(filename);

                        fs.writeFile(filename, buffers[i], null, (err) => {
                            if (err) {
                                reject(err);
                            }
                        })
                    }

                    resolve(filenames);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    return {capture};
};

module.exports = {create};