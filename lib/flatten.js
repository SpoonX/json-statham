"use strict";

module.exports = function flatten (source, basePath, target) {
  basePath = basePath || '';
  target   = target || {};

  for (let key in source) {
    if (source[key].constructor === Object) {
      flatten(source[key], basePath + key + '.', target);

      continue;
    }

    target[basePath + key] = source[key];
  }

  return target;
};
