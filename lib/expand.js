'use strict';

/**
 * Expands flat object to nested object.
 *
 * @param {{}} source
 *
 * @return {{}}
 */
module.exports = function expand(source) {
  let destination = {};

  Object.getOwnPropertyNames(source).forEach(flatKey => {

    // If the key doesn't contain a dot (isn't nested), just set the value.
    if (flatKey.indexOf('.') === -1) {
      destination[flatKey] = source[flatKey];

      return;
    }

    let tmp  = destination;         // Pointer for the nested object.
    let keys = flatKey.split('.');  // Keys (path) for the nested object.
    let key  = keys.pop();          // The last (deepest) key.

    keys.forEach(value => {
      if (typeof tmp[value] === 'undefined') {
        tmp[value] = {};
      }

      tmp = tmp[value];
    });

    tmp[key] = source[flatKey];
  });

  return destination;
};
