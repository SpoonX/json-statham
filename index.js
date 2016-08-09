'use strict';

const extend      = require('extend');
const FileSystem  = require('./lib/filesystem.js');
const expand      = require('./lib/expand');
const Utils       = require('./lib/utils');
const flatten     = require('./lib/flatten');
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
   * Constructs a new instance of Statham.
   *
   * @param {{}}     [data]       Defaults to empty object.
   * @param {String} [mode]       Defaults to nested
   * @param {String} [filePath]
   */
  constructor(data, mode, filePath) {
    this.data = data || {};

    this.setMode(mode).setFileLocation(filePath);
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
   * Recursively merges given sources into data.
   *
   * @param {{}[]} sources One or more, or array of, objects to merge into data (left to right).
   *
   * @return {Statham}
   */
  merge(sources) {
    sources       = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments);
    let mergeData = [];

    sources.forEach(source => {
      if (!source) {
        return;
      }

      if (source instanceof Statham) {
        source = source.data;
      }

      mergeData.push(this.isModeFlat() ? flatten(source) : expand(source));
    });

    extend.apply(extend, [true, this.data].concat(mergeData));

    return this;
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
   * @param {String|Array} key
   * @param {*}            [defaultValue] Value to return if key was not found
   *
   * @returns {*}
   */
  fetch(key, defaultValue) {
    defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;

    if (typeof this.data[key] !== 'undefined') {
      return this.data[key];
    }

    if (this.isModeFlat()) {
      return defaultValue;
    }

    let keys    = Utils.normalizeKey(key);
    let lastKey = keys.pop();
    let tmp     = this.data;

    for (let i = 0; i < keys.length; i++) {
      if (typeof tmp[keys[i]] === 'undefined') {
        return defaultValue;
      }

      tmp = tmp[keys[i]];
    }

    return typeof tmp[lastKey] === 'undefined' ? defaultValue : tmp[lastKey];
  }

  /**
   * Sets value for a key (creates object in path when not found).
   *
   * @param {String|Array} key    Array of key parts, or dot separated key.
   * @param {*}            value
   *
   * @returns {Statham}
   */
  put(key, value) {
    if (this.isModeFlat() || key.indexOf('.') === -1) {
      this.data[key] = value;

      return this;
    }

    let keys    = Utils.normalizeKey(key);
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
    if (this.isModeFlat() || key.indexOf('.') === -1) {
      delete this.data[key];

      return this;
    }

    let normalizedKey = Utils.normalizeKey(key);
    let lastKey       = normalizedKey.pop();
    let source        = this.fetch(normalizedKey);

    if (typeof source === 'object') {
      delete source[lastKey];
    }

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
    if (!Utils.isServer()) {
      return Utils.unsupportedEnvironment();
    }

    if (typeof filePath === 'boolean') {
      createPath = filePath;
      filePath   = undefined;
    }

    return FileSystem.save(filePath || this.filePath, !!createPath, this.data);
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
module.exports.expand  = expand;
module.exports.Statham = Statham;
