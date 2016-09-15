'use strict';

let fs      = require('fs');
let path    = require('path');
let mkdirp  = require('mkdirp');

class FileSystem {
  /**
   * Tries to load data from a json file.
   *
   * @param {String}  fileName Path to json file.
   * @param {Boolean} [ensure] If true, create file if not exists.
   *
   * @returns {Promise}
   */
  static fromFile(fileName, ensure) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (error, data) => {
        if (error) {
          if (!ensure || error.errno !== -2) {
            return reject(error);
          }

          return FileSystem.save(fileName, true, {}).then(() => resolve({}));
        }

        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch (exception) {
          return reject(exception);
        }

        resolve(parsed);
      });
    });
  }

  /**
   * Save data to file.
   *
   * @param {String}  filePath    Path of file to save to.
   * @param {Boolean} createPath  If true, creates path to file.
   * @param {{}}      data        Data to save.
   *
   * @returns {Promise}
   */
  static save(filePath, createPath, data) {
    return new Promise((resolve, reject) => {
      if (typeof filePath === 'undefined') {
        return reject(new Error('Path undefined.'));
      }

      if (createPath) {
        return mkdirp(path.dirname(filePath), error => {
          if (error) {
            return reject(error);
          }

          return FileSystem.save(filePath, false, data).then(resolve).catch(reject);
        });
      }

      fs.writeFile(filePath, JSON.stringify(data), error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }
}

module.exports = FileSystem;
