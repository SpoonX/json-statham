"use strict";

let fs      = require('fs');
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

        resolve(new Statham(parsed, mode));
      });
    });
  }

  /**
   * Constructs a new instance of Statham.
   *
   * @param {{}}     data
   * @param {String} [mode]
   */
  constructor(data, mode) {
    this.data = data;

    this.setMode(mode);
  }

  /**
   * Sets the mode.
   *
   * @param {String} [mode] Defaults to nested.
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

    keys.forEach(value => {
      tmp = tmp[value];
    });

    return tmp[lastKey];
  }

  put(key, value) {
    if (this.isModeFlat() || key.search('.') === -1) {
      this.data[key] = value;

      return this;
    }

    let keys    = key.split('.');
    let lastKey = keys.pop();
    let tmp     = this.data;

    keys.forEach(value => {
      if(typeof tmp[value] === 'undefined') {
        tmp[value] = {};
      }

      tmp = tmp[value];
    });

    tmp[lastKey] = value;

    return this;
  }

  remove(key) {
    if (typeof this.data[key] !== 'undefined') {
      delete this.data[key];

      return this;
    }

    let keys    = key.split('.');
    let lastKey = keys.pop();
    let tmp     = this.data;

    keys.forEach(value => {
      if (typeof tmp[value] === 'undefined') {
        return undefined;
      }
      
      tmp = tmp[value];
    });

    delete tmp[lastKey];

    return this;
  }
}

module.exports.flatten = flatten;
module.exports.expand  = expand;
module.exports.Statham = Statham;
