"use strict";

module.exports = function expand(source) {
  let destination = {};

  Object.getOwnPropertyNames(source).forEach(flatKey => {
    if (flatKey.indexOf('.') === -1) {
      destination[flatKey] = source[flatKey];

      return;
    }

    let tmp  = destination;
    let keys = flatKey.split('.');
    let key  = keys.pop();

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
