const IStore = require("./IStore");
const fs = require('fs');
const path = require('path');

class FSStore extends IStore {
    /**
     *
     * @param jsonpolicy : filename with extention
     * @returns {*} : the full path of the file
     */
    getSourcePath(jsonpolicy = 'policy.json') {
        return path.resolve(__dirname, `../source/${jsonpolicy}`);
    }

    /**
     * @param {String} source path to the json file
     */
    getSource(source) {
        source = source || this.getSourcePath();
        return new Promise((resolve, reject) => {
            fs.stat(source, function (err, stat) {
                if (err) {
                    return reject(err);
                }
                if (stat.isFile()) {
                    fs.readFile(source, function (err, data) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(JSON.parse(data));
                    });
                }
            })
        });
    }

    /**
     * @param {Object} opt
     * @param {String} opt.id
     * @param {String} opt.type
     * @returns Promise
     */
    getPolicy(opt, src) {
        return this.getSource(src).then(sources => {
            let result = null;
            sources.some(policy => {
                if (policy.target["id"] == opt.id && policy.target["type"] == opt.type) {
                    result = policy;
                    return true;
                }
            });
            return result;
        });
    }
}
module.exports = new FSStore();