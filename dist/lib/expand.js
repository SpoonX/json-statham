'use strict';

/**
 * Expands flat object to nested object.
 *
 * @param {{}} source
 *
 * @return {{}}
 */
module.exports = function expand(source) {
  var destination = {};

  Object.getOwnPropertyNames(source).forEach(function (flatKey) {

    // If the key doesn't contain a dot (isn't nested), just set the value.
    if (flatKey.indexOf('.') === -1) {
      destination[flatKey] = source[flatKey];

      return;
    }

    var tmp  = destination;         // Pointer for the nested object.
    var keys = flatKey.split('.');  // Keys (path) for the nested object.
    var key  = keys.pop();          // The last (deepest) key.

    keys.forEach(function (value) {
      if (typeof tmp[value] === 'undefined') {
        tmp[value] = {};
      }

      tmp = tmp[value];
    });

    tmp[key] = source[flatKey];
  });

  return destination;
};
