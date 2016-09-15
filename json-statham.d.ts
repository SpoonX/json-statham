import {Homefront} from "homefront/homefront";
/**
 * Expands flat object to nested object.
 *
 * @param {{}} source
 *
 * @return {{}}
 */
export declare function expand(source?:{}):{};
export declare class FileSystem {
  static fromFile(fileName?:any, ensure?:boolean):any;

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
 * Kick your JSON's ass, with json-statham's help.
 */
export declare class Statham extends Homefront {

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
   * @param {String}  fileName
   * @param {String}  [mode]
   * @param {Boolean} [ensure]
   *
   * @return {Promise}
   */
  static fromFile(fileName?:string, mode?:string, ensure?:boolean):Promise;

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
}
export declare class Utils {

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
