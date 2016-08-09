/**
 * Expands flat object to nested object.
 *
 * @param {{}} source
 *
 * @return {{}}
 */
export declare function expand(source?:{}):{};
export declare class FileSystem {
  static fromFile(fileName?:any):any;

  /**
   * Save data to file.
   *
   * @param {String}  filePath    Path of file to save to.
   * @param {Boolean} createPath  If true, creates path to file.
   * @param {{}}      data        Data to save.
   *
   * @returns {Promise}
   */
  static save(filePath?:string, createPath?:boolean, data?:{}):Promise;
}

/**
 * Flattens nested object (dot separated keys).
 *
 * @param {{}}      source
 * @param {String}  [basePath]
 * @param {{}}      [target]
 *
 * @return {{}}
 */
export declare function flatten(source?:{}, basePath?:string, target?:{}):{};
/**
 * Kick your JSON's ass, with json-statham's help.
 */
export declare class Statham {

  /**
   * @return {string}
   */
  static MODE_NESTED:string;

  /**
   * @return {string}
   */
  static MODE_FLAT:string;

  /**
   * Constructs a new instance of Statham.
   *
   * @param {{}}     [data]       Defaults to empty object.
   * @param {String} [mode]       Defaults to nested
   * @param {String} [filePath]
   */
  constructor(data?:{}, mode?:string, filePath?:string);

  /**
   * Creates a new instance using the data from `fileName`.
   *
   * @param {String} fileName
   * @param {String} [mode]
   *
   * @return {Promise}
   */
  static fromFile(fileName?:string, mode?:string):Promise;

  /**
   * Recursively merges given sources into data.
   *
   * @param {{}[]} sources One or more, or array of, objects to merge into data (left to right).
   *
   * @return {Statham}
   */
  merge(...sources:Array<{}|Statham>):Statham;

  /**
   * Sets the mode.
   *
   * @param {String} [mode] Defaults to nested.
   *
   * @returns {Statham} Fluent interface
   *
   * @throws {Error}
   */
  setMode(mode?:string):Statham;

  /**
   * Gets the mode.
   *
   * @return {String}
   */
  getMode():string;

  /**
   * Expands flat object to nested object.
   *
   * @return {{}}
   */
  expand(source?:{}):{};

  /**
   * Flattens nested object (dot separated keys).
   *
   * @return {{}}
   */
  flatten(source?:{}, basePath?:string, target?:{}):{};

  /**
   * Returns whether or not mode is flat.
   *
   * @return {boolean}
   */
  isModeFlat():boolean;

  /**
   * Returns whether or not mode is nested.
   *
   * @return {boolean}
   */
  isModeNested():boolean;

  /**
   * Fetches value of given key.
   *
   * @param {String} key
   * @param {{}}     [data] Base object to search in
   *
   * @returns {*}
   */
  fetch(key?:string, data?:{}):any;

  /**
   * Sets value for a key.
   *
   * @param {String|Array} key    Array of key parts, or dot separated key.
   * @param {*}            value
   *
   * @returns {Statham}
   */
  put(key?:string | Array<string>, value?:any):Statham;

  /**
   * Removes value by key.
   *
   * @param {String} key
   *
   * @returns {Statham}
   */
  remove(key?:string):Statham;

  /**
   * Sets path to file.
   *
   * @param {String} [filePath] Defaults to `undefined`.
   *
   * @returns {Statham}
   */
  setFileLocation(filePath?:string):Statham;

  /**
   * Save current state of data to file.
   *
   * @param {String|Boolean} [filePath]   Path of file to save to. If boolean, used for `createPath`.
   * @param {Boolean}        [createPath] If true, creates path to file. Defaults to false.
   *
   * @returns {Promise}
   */
  save(filePath?:string | boolean, createPath?:boolean):Promise;

  /**
   * Search and return keys and values that match given string.
   *
   * @param {String|Number} phrase
   *
   * @returns {Array}
   */
  search(phrase?:string | number):Array<any>;
}
export declare class Utils {

  /**
   * Used to normalize keys of mixed array and dot-separated string to a single array of undotted strings.
   *
   * @param {string|Array} rest (dot-separated) string(s) or array of keys
   *
   * @return {Array} The key normalized to an array of simple strings
   */
  static normalizeKey(...rest:string | Array<string>):Array<string>;

  /**
   * Returns whether or not the environment is server-side.
   *
   * @return {boolean}
   */
  static isServer():boolean;

  /**
   * Convenience method to return a rejected error for unsupported environment.
   *
   * @return {Promise}
   */
  static unsupportedEnvironment():Promise;
}
