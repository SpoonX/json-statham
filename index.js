"use strict";

let fs     = require('fs');
let expand = require('./lib/expand');

class Statham {
  static fromFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (error, data) => {
        if (error) {
          return reject(error);
        }

        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch (exception) {
          return reject(exception);
        }

        resolve(new Statham(parsed));
      });
    });
  }

  constructor(data) {
    this.data = data;
  }

  expand() {
    return expand(this.data);
  }
}

module.exports.expand  = expand;
module.exports.Statham = Statham;
