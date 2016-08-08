'use strict';

var fs      = require('fs');
var path    = require('path');
var mkdirp  = require('mkdirp');

var FileSystem = function FileSystem () {};

FileSystem.fromFile = function fromFile (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf8', function (error, data) {
      if (error) {
        return reject(error);
      }

      var parsed;

      try {
        parsed = JSON.parse(data);
      } catch (exception) {
        return reject(exception);
      }

      resolve(parsed);
    });
  });
};

/**
 * Save data to file.
 *
 * @param {String}filePath  Path of file to save to.
 * @param {Boolean} createPathIf true, creates path to file.
 * @param {{}}    data      Data to save.
 *
 * @returns {Promise}
 */
FileSystem.save = function save (filePath, createPath, data) {
  return new Promise(function (resolve, reject) {
    if (typeof filePath === 'undefined') {
      return reject(new Error('Path undefined.'));
    }

    if (createPath) {
      return mkdirp(path.dirname(filePath), function (error) {
        if (error) {
          return reject(error);
        }

        return FileSystem.save(filePath, false, data).then(resolve).catch(reject);
      });
    }

    fs.writeFile(filePath, JSON.stringify(data), function (error) {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};

module.exports = FileSystem;
