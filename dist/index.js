'use strict';

var extend      = require('extend');
var FileSystem  = require('./lib/filesystem.js');
var expand      = require('./lib/expand');
var Utils       = require('./lib/utils');
var flatten     = require('./lib/flatten');
var MODE_FLAT   = 'flat';
var MODE_NESTED = 'nested';
var MODES       = [MODE_FLAT, MODE_NESTED];

/**
 * Kick your JSON's ass, with json-statham's help.
 */
var Statham = function Statham(data, mode, filePath) {
  this.data = data || {};

  this.setMode(mode).setFileLocation(filePath);
};

var staticAccessors = { MODE_NESTED: {},MODE_FLAT: {} };

/**
 * Creates a new instance using the data from `fileName`.
 *
 * @param {String} fileName
 * @param {String} [mode]
 *
 * @return {Promise}
 */
staticAccessors.MODE_NESTED.get = function () {
  return MODE_NESTED;
};

/**
 * @return {string}
 */
staticAccessors.MODE_FLAT.get = function () {
  return MODE_FLAT;
};

Statham.fromFile = function fromFile (fileName, mode) {
  if (!Utils.isServer()) {
    return Utils.unsupportedEnvironment();
  }

  return FileSystem.fromFile(fileName).then(function (data) { return new Statham(data, mode, fileName); });
};

/**
 * Recursively merges given sources into data.
 *
 * @param {{}[]} sources One or more, or array of, objects to merge into data (left to right).
 *
 * @return {Statham}
 */
Statham.prototype.merge = function merge (sources) {
    var this$1 = this;

  sources     = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments);
  var mergeData = [];

  sources.forEach(function (source) {
    if (!source) {
      return;
    }

    mergeData.push(this$1.isModeFlat() ? flatten(source) : expand(source));
  });

  extend.apply(extend, [true, this.data].concat(mergeData));

  return this;
};

/**
 * Sets the mode.
 *
 * @param {String} [mode] Defaults to nested.
 *
 * @returns {Statham} Fluent interface
 *
 * @throws {Error}
 */
Statham.prototype.setMode = function setMode (mode) {
  mode = mode || MODE_NESTED;

  if (MODES.indexOf(mode) === -1) {
    throw new Error(
      ("Invalid mode supplied. Must be one of \"" + (MODES.join('" or "')) + "\"")
    );
  }

  this.mode = mode;

  return this;
};

/**
 * Gets the mode.
 *
 * @return {String}
 */
Statham.prototype.getMode = function getMode () {
  return this.mode;
};

/**
 * Expands flat object to nested object.
 *
 * @return {{}}
 */
Statham.prototype.expand = function expand$1 () {
  return this.isModeNested() ? this.data : expand(this.data);
};

/**
 * Flattens nested object (dot separated keys).
 *
 * @return {{}}
 */
Statham.prototype.flatten = function flatten$1 () {
  return this.isModeFlat() ? this.data : flatten(this.data);
};

/**
 * Returns whether or not mode is flat.
 *
 * @return {boolean}
 */
Statham.prototype.isModeFlat = function isModeFlat () {
  return this.mode === MODE_FLAT;
};

/**
 * Returns whether or not mode is nested.
 *
 * @return {boolean}
 */
Statham.prototype.isModeNested = function isModeNested () {
  return this.mode === MODE_NESTED;
};

/**
 * Fetches value of given key.
 *
 * @param {String} key
 * @param {String} [data] Base object to search in
 *
 * @returns {*}
 */
Statham.prototype.fetch = function fetch (key, data) {
  var rest = Utils.normalizeKey(key);
  key    = rest.shift();
  data   = data || this.data;

  return rest.length === 0 ? data[key] : this.fetch(rest, data[key]);
};

/**
 * Sets value for a key.
 *
 * @param {String|Array} key  Array of key parts, or dot separated key.
 * @param {*}          value
 *
 * @returns {Statham}
 */
Statham.prototype.put = function put (key, value) {
  if (this.isModeFlat() || key.search('.') === -1) {
    this.data[key] = value;

    return this;
  }

  var normalizedKey = Utils.normalizeKey(key);
  var lastKey     = normalizedKey.pop();
  var source      = this.fetch(normalizedKey);

  if (typeof source === 'object') {
    source[lastKey] = value;
  }

  return this;
};

/**
 * Removes value by key.
 *
 * @param {String} key
 *
 * @returns {Statham}
 */
Statham.prototype.remove = function remove (key) {
  if (this.isModeFlat() || key.search('.') === -1) {
    delete this.data[key];

    return this;
  }

  var normalizedKey = Utils.normalizeKey(key);
  var lastKey     = normalizedKey.pop();
  var source      = this.fetch(normalizedKey);

  if (typeof source === 'object') {
    delete source[lastKey];
  }

  return this;
};

/**
 * Sets path to file.
 *
 * @param {String} [filePath] Defaults to `undefined`.
 *
 * @returns {Statham}
 */
Statham.prototype.setFileLocation = function setFileLocation (filePath) {
  this.filePath = filePath || undefined;

  return this;
};

/**
 * Save current state of data to file.
 *
 * @param {String|Boolean} [filePath] Path of file to save to. If boolean, used for `createPath`.
   * @param {Boolean}      [createPath] If true, creates path to file. Defaults to false.
 *
 * @returns {Promise}
 */
Statham.prototype.save = function save (filePath, createPath) {
  if (!Utils.isServer()) {
    return Utils.unsupportedEnvironment();
  }

  if (typeof filePath === 'boolean') {
    createPath = filePath;
    filePath = undefined;
  }

  return FileSystem.save(filePath || this.filePath, !!createPath, this.data);
};

/**
 * Search and return keys and values that match given string.
 *
 * @param {String|Number} phrase
 *
 * @returns {Array}
 */
Statham.prototype.search = function search (phrase) {
  var found = [];
  var data= this.data;

  if (this.isModeNested()) {
    data = flatten(this.data);
  }

  Object.getOwnPropertyNames(data).forEach(function (key) {
    var searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];

    if (searchTarget.search(phrase) > -1) {
      found.push({key: key, value: data[key]});
    }
  });

  return found;
};

Object.defineProperties( Statham, staticAccessors );

module.exports.flatten = flatten;
module.exports.expand  = expand;
module.exports.expand  = expand;
module.exports.Statham = Statham;
