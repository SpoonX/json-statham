'use strict';

const FileSystem  = require('./lib/filesystem.js');
const Utils       = require('./lib/utils');
const Homefront   = require('homefront').Homefront;

/**
 * Kick your JSON's ass, with json-statham's help.
 */
class Statham extends Homefront {
  /**
   * Constructs a new instance of Statham.
   *
   * @param {{}}     [data]       Defaults to empty object.
   * @param {String} [mode]       Defaults to nested
   * @param {String} [filePath]
   */
  constructor(data, mode, filePath) {
    super(data, mode);

    this.setFileLocation(filePath);
  }

  /**
   * Creates a new instance using the data from `fileName`.
   *
   * @param {String} fileName
   * @param {String} [mode]
   *
   * @return {Promise}
   */
  static fromFile(fileName, mode) {
    if (!Utils.isServer()) {
      return Utils.unsupportedEnvironment();
    }

    return FileSystem.fromFile(fileName).then(data => new Statham(data, mode, fileName));
  }

  /**
   * Sets path to file.
   *
   * @param {String} [filePath] Defaults to `undefined`.
   *
   * @returns {Statham}
   */
  setFileLocation(filePath) {
    this.filePath = filePath || undefined;

    return this;
  }

  /**
   * Save current state of data to file.
   *
   * @param {String|Boolean} [filePath]   Path of file to save to. If boolean, used for `createPath`.
   * @param {Boolean}        [createPath] If true, creates path to file. Defaults to false.
   *
   * @returns {Promise}
   */
  save(filePath, createPath) {
    if (!Utils.isServer()) {
      return Utils.unsupportedEnvironment();
    }

    if (typeof filePath === 'boolean') {
      createPath = filePath;
      filePath   = undefined;
    }

    return FileSystem.save(filePath || this.filePath, !!createPath, this.data);
  }

}

module.exports.Statham = Statham;
