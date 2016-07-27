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
          'Unsupported environment. This method only works on the server (node.js).',
          'Did not get the expected exception.'
        );

        done();
      }).catch(done);
    });
  });

  describe('static .normalizeKey()', () => {
    it('Should properly normalize given key.', () => {
      let weirdKeyOne   = 'some.stupid.idea';
      let weirdKeyTwo   = 'maybe';
      let weirdKeyThree = '.';
      let weirdKeyFour  = ['I', 'should', 'give', 'up'];
      let weirdKeyFive  = '';

      assert.deepEqual(Utils.normalizeKey(weirdKeyOne), ['some', 'stupid', 'idea'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyTwo), ['maybe'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyThree), ['', ''], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyFour), ['I', 'should', 'give', 'up'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyFive), [''], 'Unexpected key.');
    });
  });
});
