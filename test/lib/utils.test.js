"use strict";

let assert = require('chai').assert;
let Utils  = require('../../lib/utils');

describe('Utils', () => {
  describe('static .isServer()', () => {
    it('Should properly detect the environment.', () => {
      assert.strictEqual(Utils.isServer(), true, 'Well, Who is running the tests in a browser!?');
      global.window = true;
      assert.strictEqual(Utils.isServer(), false, 'Expected utils to detect the env as a browser now.');
      global.window = undefined;
    });
  });

  describe('static .unsupportedEnvironment()', () => {
    it('Should return a disappointing rejected promise.', done => {
      assert.instanceOf(Utils.unsupportedEnvironment(), Promise, 'But you promised me!');

      Utils.unsupportedEnvironment().catch(hitMe => {
        assert.strictEqual(
          hitMe.message,
          'Unsupported environment. For a browser-compatible version, go to https://www.npmjs.com/package/homefront',
          'Did not get the expected exception.'
        );

        done();
      }).catch(done);
    });
  });

});
