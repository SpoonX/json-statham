"use strict";

let assert = require('chai').assert;
let expand = require('../../lib/expand');
let flat   = require('../resources/flat.json');
let nested = require('../resources/nested.json');

describe('expand()', () => {
  it('Should expand flat object.', () => {
    assert.deepEqual(expand(flat), nested, 'It is not nested like we want it to be.');
  });

  it('Should return identical nested object.', () => {
    assert.deepEqual(expand(nested), nested, 'It is not identical like we want it to be.');
  });

  it('Should not lose its shit over an empty object.', () => {
    assert.deepEqual(expand({}), {}, 'Well, okay then.');
  });
});
