"use strict";

let assert  = require('chai').assert;
let flat    = require('./resources/flat.json');
let nested  = require('./resources/nested.json');
let Statham = require('../index.js').Statham;

let testFlat = new Statham(flat);
let testNested = new Statham(nested);
let testEmpty = new Statham({});


describe('Statham.fromFile()', () => {
  // @todo test.
});


describe('constructor', () => {
  it('Should create a new instance based on the file\'s data (flat).', () => {
    assert.deepEqual(testFlat.data, flat, 'It did not create a new instance.');
  });

  it('Should create a new instance based on the file\'s data (nested).', () => {
    assert.deepEqual(testNested.data, nested, 'It did not create a new instance.');
  });

  it('Should create a new instance based on an empty object.', () => {
    assert.deepEqual(testEmpty.data, {}, 'It did not create an empty object.');
  });

  it('Should have mode set as "nested" by default.', () => {
    assert.strictEqual(testFlat.mode, 'nested', 'Mode is not set.');
  });

  it('Should accept mode as second argument.', () => {
    let testMode = new Statham(flat, 'flat');
    assert.strictEqual(testMode.mode, 'flat', 'It did not accept mode.');
  });
});

describe('setMode()', () => {
  it('Should have mode set to nested by default.', () => {
    testFlat.setMode();
    assert.strictEqual(testFlat.mode, 'nested', 'It did not set mode by default.');
  });

  it('Should set mode to flat.', () => {
    testFlat.setMode('flat');
    assert.strictEqual(testFlat.mode, 'flat', 'It did not set the mode to flat.');
  });

  it('Should set mode to nested.', () => {
    testNested.setMode('nested');
    assert.strictEqual(testNested.mode, 'nested', 'It did not set the mode to nested.');
  });

  it('Should return error if mode is invalid.', () => {
    // @todo test.
  });
});

describe('getMode()', () => {
  it('Should return "flat" when getting the mode of a flat object.', () => {
    assert.strictEqual(testFlat.getMode(), 'flat', 'It did not return what we expected.');
  });

  it('Should return "nested" when getting the mode of a nested object.', () => {
    assert.strictEqual(testNested.getMode(), 'nested', 'It did not return what we expected.');
  });
});

describe('expand()', () => {
  it('Should expand flat object.', () => {
    assert.deepEqual(testFlat.expand(), nested, 'It did not expand object.');
  });

  it('Should return itself if the object is already nested.', () => {
    assert.deepEqual(testNested.expand(), testNested.data, 'It did not return the object.');
  });
});

describe('flatten()', () => {
  it('Should flatten nested object.', () => {
    assert.deepEqual(testNested.flatten(), flat, 'It did not flatten object.');
  });

  it('Should return itself if object is already flat.', () => {
    assert.deepEqual(testFlat.flatten(), testFlat.data, 'It did not return the object.');
  });
});

describe('isModeFlat()', () => {
  it("Should return 'true' if the object's mode is set to flat.", () => {
    assert.strictEqual(testFlat.isModeFlat(), true, 'It does not return true.');
  });

  it("Should return 'false' if the object's mode is set to nested.", () => {
    assert.strictEqual(testNested.isModeFlat(), false, 'It does not return false.');
  });
});

describe('isModeNested()', () => {
  it("Should return 'true' if the object's mode is set to nested.", () => {
    assert.strictEqual(testNested.isModeNested(), true, 'It does not return true.');
  });

  it("Should return 'false' if the object's mode is set to flat.", () => {
    assert.strictEqual(testFlat.isModeNested(), false, 'It does not return false.');
  });
});
