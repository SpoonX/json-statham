'use strict';

class Utils {

  /**
   * Returns whether or not the environment is server-side.
   *
   * @return {boolean}
   */
  static isServer() {
    return typeof window === 'undefined';
  }

  /**
   * Convenience method to return a rejected error for unsupported environment.
   *
   * @return {Promise}
   */
  static unsupportedEnvironment() {
    return Promise.reject(new Error('Unsupported environment. For a browser-compatible version, go to https://www.npmjs.com/package/homefront'));
  }
}

module.exports = Utils;
