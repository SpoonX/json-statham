'use strict';

var Utils = require('./utils');

/**
 * Flattens nested object (dot separated keys).
 *
 * @param {{}}      source
 * @param {String}  [basePath]
 * @param {{}}      [target]
 *
 * @return {{}}
 */
module.exports = function flatten(source, basePath, target) {
  basePath = basePath || '';
  target   = target || {};

  Object.getOwnPropertyNames(source).forEach(function (key) {
    if (Utils.isPojo(source[key])) {
      flatten(source[key], basePath + key + '.', target);

      return;
    }

    target[basePath + key] = source[key];
  });

  return target;
};
