'use strict';

var Utils = function Utils () {};

Utils.normalizeKey = function normalizeKey (rest) {
  rest         = Array.isArray(rest) ? rest : Array.prototype.slice.call(arguments);
  var key      = rest.shift();
  var normalized = Array.isArray(key) ? Utils.normalizeKey(key) : key.split('.');

  return rest.length === 0 ? normalized : normalized.concat(Utils.normalizeKey(rest));
};

/**
 * Returns whether or not the environment is server-side.
 *
 * @return {boolean}
 */
Utils.isServer = function isServer () {
  return typeof window === 'undefined';
};

/**
 * Convenience method to return a rejected error for unsupported environment.
 *
 * @return {Promise}
 */
Utils.unsupportedEnvironment = function unsupportedEnvironment () {
  return Promise.reject(new Error('Unsupported environment. This method only works on the server (node.js).'));
};

module.exports = Utils;
