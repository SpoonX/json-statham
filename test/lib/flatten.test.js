"use strict";

let assert  = require('chai').assert;
let nested  = require('../resources/nested.json');
let flat    = require('../resources/flat.json');
let flatten = require('../../lib/flatten');

describe('flatten()', () => {
  it('Should flatten a nested object.', () => {
    assert.deepEqual(flatten(nested), flat, 'Not flat the way we want it to be.');
  });

  it('Should return identical flat object when given a flat object.', () => {
    assert.deepEqual(flatten(flat), flat, 'Not identical like we want it to be.');
  });

  it('Should use given target.', () => {
    let target = {};

    flatten(nested, null, target);

    assert.deepEqual(target, flat, 'Did not use target!');
  });

  it('Should not lose its shit over an empty object.', () => {
    assert.deepEqual(flatten({}), {}, 'Well, okay then.');
  });
});
