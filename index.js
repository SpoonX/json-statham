'use strict';

let fs      = require('fs');
let path    = require('path');
let mkdirp  = require('mkdirp');
let expand  = require('./lib/expand');
let flatten = require('./lib/flatten');

const MODE_FLAT   = 'flat';
const MODE_NESTED = 'nested';
const MODES       = [MODE_FLAT, MODE_NESTED];

/**
 * Kick your JSON's ass, with json-statham's help.
 */
class Statham {

  /**
   * @return {string}
   */
  static get MODE_NESTED() {
    return MODE_NESTED;
  }

  /**
   * @return {string}
   */
  static get MODE_FLAT() {
    return MODE_FLAT;
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
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (error, data) => {
        if (error) {
          return reject(error);
        }

        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch (exception) {
          return reject(exception);
        }

        let statham = new Statham(parsed, mode, fileName);

        resolve(statham);
      });
    });
  }

  /**
   * Constructs a new instance of Statham.
   *
   * @param {{}}     data
   * @param {String} [mode]
   * @param {String} [filePath]
   */
  constructor(data, mode, filePath) {
    this.data = data;

    this.setMode(mode).setFileLocation(filePath);
  }

  /**
   * Sets the mode.
   *
   * @param {String} [mode] Defaults to nested.
   *
   * @returns {Statham} Fluent interface
   *
   * @throws {Error}
   */
  setMode(mode) {
    mode = mode || MODE_NESTED;

    if (MODES.indexOf(mode) === -1) {
      throw new Error(
        `Invalid mode supplied. Must be one of "${MODES.join('" or "')}"`
      );
    }

    this.mode = mode;

    return this;
  }

  /**
   * Gets the mode.
   *
   * @return {String}
   */
  getMode() {
    return this.mode;
  }

  /**
   * Expands flat object to nested object.
   *
   * @return {{}}
   */
  expand() {
    return this.isModeNested() ? this.data : expand(this.data);
  }

  /**
   * Flattens nested object (dot separated keys).
   *
   * @return {{}}
   */
  flatten() {
    return this.isModeFlat() ? this.data : flatten(this.data);
  }

  /**
   * Returns whether or not mode is flat.
   *
   * @return {boolean}
   */
  isModeFlat() {
    return this.mode === MODE_FLAT;
  }

  /**
   * Returns whether or not mode is nested.
   *
   * @return {boolean}
   */
  isModeNested() {
    return this.mode === MODE_NESTED;
  }

  /**
   * Fetches value of given key.
   *
   * @param {String} key
   *
   * @returns {*}
   */
  fetch(key) {
    if (typeof this.data[key] !== 'undefined') {
      return this.data[key];
    }

    if (this.isModeFlat()) {
      return undefined;
    }

    let keys    = key.split('.');
    let lastKey = keys.pop();
    let tmp     = this.data;

    for (let i = 0; i < keys.length; i++) {
      if (typeof tmp[keys[i]] === 'undefined') {
        return this;
      }

      tmp = tmp[keys[i]];
    }

    return tmp[lastKey];
  }

  /**
   * Sets value for a key.
   *
   * @param {String} key
   * @param {*} value
   *
   * @returns {Statham}
   */
  put(key, value) {
    if (this.isModeFlat() || key.search('.') === -1) {
      this.data[key] = value;

      return this;
    }

    let keys    = key.split('.');
    let lastKey = keys.pop();
    let tmp     = this.data;

    keys.forEach(value => {
      if (typeof tmp[value] === 'undefined') {
        tmp[value] = {};
      }

      tmp = tmp[value];
    });

    tmp[lastKey] = value;

    return this;
  }

  /**
   * Removes value by key.
   *
   * @param {String} key
   *
   * @returns {Statham}
   */
  remove(key) {
    if (typeof this.data[key] !== 'undefined') {
      delete this.data[key];

      return this;
    }

    let keys    = key.split('.');
    let lastKey = keys.pop();
    let tmp     = this.data;

    for (let i = 0; i < keys.length; i++) {
      if (typeof tmp[keys[i]] === 'undefined') {
        return this;
      }

      tmp = tmp[keys[i]];
    }

    delete tmp[lastKey];

    return this;
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
    if (typeof filePath === 'boolean') {
      createPath = filePath;
      filePath   = undefined;
    }

    filePath   = filePath || this.filePath;
    createPath = createPath || false;

    return new Promise((resolve, reject) => {
      if (typeof filePath === 'undefined') {
        throw new Error('Path undefined.');
      }

      let data = JSON.stringify(this.data);

      if (createPath) {
        mkdirp(path.dirname(filePath), error => {
          if (error) {
            return reject(error);
          }

          this.save(filePath).then(() => {
            resolve(this);
          });
        });

        return;
      }

      fs.writeFile(filePath, data, error => {
        if (error) {
          return reject(error);
        }

        resolve(this);
      });
    });
  }

  /**
   * Search and return keys and values that match given string.
   *
   * @param {String|Number} phrase
   *
   * @returns {Array}
   */
  search(phrase) {
    let found = [];
    let data  = this.data;

    if (this.isModeNested()) {
      data = flatten(this.data);
    }

    Object.getOwnPropertyNames(data).forEach(key => {
      let searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];
      
      if (searchTarget.search(phrase) > -1) {
        found.push({key: key, value: data[key]});
      }
    });

    return found;
  }
}

module.exports.flatten = flatten;
module.exports.expand  = expand;
module.exports.Statham = Statham;
