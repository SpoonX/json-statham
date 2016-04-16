"use strict";

let assert  = require('chai').assert;
let flat    = require('./resources/flat.json');
let nested  = require('./resources/nested.json');
let Statham = require('../index.js').Statham;

describe('Statham', () => {
  describe('static .fromFile()', () => {
    it('Should return a new Statham instance with the data from given file.', done => {
      Statham.fromFile(__dirname + '/resources/nested.json').then(statham => {
        assert.instanceOf(statham, Statham, 'Not sure what happened here.');

        done();
      });
    });

    it('Should return a new Statham instance with the data from given file and given mode.', done => {
      let instanceCreationPromises = [
        Statham.fromFile(__dirname + '/resources/flat.json', Statham.MODE_FLAT),
        Statham.fromFile(__dirname + '/resources/nested.json', Statham.MODE_NESTED)
      ];

      Promise.all(instanceCreationPromises).then(results => {
        assert.strictEqual(results[0].mode, Statham.MODE_FLAT, 'Mode is not flat.');
        assert.strictEqual(results[1].mode, Statham.MODE_NESTED, 'Mode is not nested.');

        done();
      });
    });
  });

  describe('.constructor()', () => {
    it("Should create a new instance with a flat object.", () => {
      let statham = new Statham(flat);

      assert.deepEqual(statham.data, flat, 'Object was not assigned properly.');
    });

    it("Should create a new instance with a nested object.", () => {
      let statham = new Statham(nested);

      assert.deepEqual(statham.data, nested, 'Object was not assigned properly.');
    });

    it('Should create a new instance with an empty object.', () => {
      let statham = new Statham({});

      assert.deepEqual(statham.data, {}, 'Object was not assigned properly.');
    });

    it('Should expose constant MODE_FLAT.', () => {
      assert.equal(Statham.MODE_FLAT, 'flat', 'Mode not exposed properly.');
    });

    it('Should expose constant MODE_NESTED.', () => {
      assert.equal(Statham.MODE_NESTED, 'nested', 'Mode not exposed properly.');
    });

    it('Should have mode set as "nested" by default.', () => {
      let statham = new Statham({});

      assert.strictEqual(statham.mode, Statham.MODE_NESTED, 'Mode does not default to nested.');
    });

    it('Should accept mode as second argument.', () => {
      let statham = new Statham({}, Statham.MODE_FLAT);

      assert.strictEqual(statham.mode, 'flat', 'It did not accept or assign mode.');
    });
  });

  describe('.setMode()', () => {
    it('Should have mode set to nested by default.', () => {
      let statham = new Statham({});

      assert.strictEqual(statham.mode, Statham.MODE_NESTED, 'It did not set mode "nested" by default.');
    });

    it('Should set mode to flat.', () => {
      let statham = new Statham({});

      statham.setMode(Statham.MODE_FLAT);

      assert.strictEqual(statham.mode, 'flat', 'It did not set the mode to flat.');
    });

    it('Should set mode to nested.', () => {
      let statham = new Statham({});

      statham.setMode(Statham.MODE_NESTED);

      assert.strictEqual(statham.mode, 'nested', 'It did not set the mode to nested.');
    });

    it('Should return error if mode is invalid.', () => {
      let statham = new Statham({});

      assert.throws(() => {
        statham.setMode('single');
      }, Error);
    });
  });

  describe('.getMode()', () => {
    it('Should return "flat" when getting the mode of a flat object.', () => {
      let statham = new Statham({}, Statham.MODE_FLAT);

      assert.strictEqual(statham.getMode(), 'flat', 'It did not return what we expected.');
    });

    it('Should return "nested" when getting the mode of a nested object.', () => {
      let statham = new Statham({}, Statham.MODE_NESTED);

      assert.strictEqual(statham.getMode(), 'nested', 'It did not return what we expected.');
    });
  });

  describe('.expand()', () => {
    it('Should expand flat object.', () => {
      let statham = new Statham(flat, Statham.MODE_FLAT);

      assert.deepEqual(statham.expand(), nested, 'It did not expand object.');
    });

    it('Should return data untouched if the object is already nested.', () => {
      let statham = new Statham(nested, Statham.MODE_NESTED);

      assert.strictEqual(statham.expand(), nested, 'It did not return the object.');
    });
  });

  describe('.flatten()', () => {
    it('Should flatten nested object.', () => {
      let statham = new Statham(nested, Statham.MODE_NESTED);

      assert.deepEqual(statham.flatten(), flat, 'It did not flatten object.');
    });

    it('Should return data untouched if object is already flat.', () => {
      let statham = new Statham(flat, Statham.MODE_FLAT);

      assert.strictEqual(statham.flatten(), flat, 'It did not return the object.');
    });
  });

  describe('.isModeFlat()', () => {
    it("Should return `true` if the instance's mode is set to flat.", () => {
      let statham = new Statham({}, Statham.MODE_FLAT);

      assert.strictEqual(statham.isModeFlat(), true, 'It does not return true.');
    });

    it("Should return `false` if the instance's mode is set to nested.", () => {
      let statham = new Statham({}, Statham.MODE_NESTED);

      assert.strictEqual(statham.isModeFlat(), false, 'It does not return false.');
    });
  });

  describe('.isModeNested()', () => {
    it("Should return `true` if the object's mode is set to nested.", () => {
      let statham = new Statham({}, Statham.MODE_NESTED);

      assert.strictEqual(statham.isModeNested(), true, 'It does not return true.');
    });

    it("Should return `false` if the object's mode is set to flat.", () => {
      let statham = new Statham({}, Statham.MODE_FLAT);

      assert.strictEqual(statham.isModeNested(), false, 'It does not return true.');
    });
  });

  describe('.fetch()', () => {
    it("Should return value of given key in a nested instance.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});

      assert.strictEqual(statham.fetch('food.bacon.taste'), statham.data.food.bacon.taste, 'Values do not match.');
    });

    it("Should return 'undefined' if the intance's mode is flat.", () => {
      let statham = new Statham({"food.bacon.taste": 'good'}, Statham.MODE_FLAT);

      assert.isUndefined(statham.fetch('food.bacon'), 'It did not return "undefined"');
    });
  });

  describe('.put()', () => {
    it("Should put a new key and value in the nested intance's data.", () => {
      let statham = new Statham({food: {bacon: {}}});
      statham.put('food.bacon.whatevs', 'ok');

      assert.deepProperty(statham.data, 'food.bacon.whatevs', 'Key and value not set properly.');
    });

    it("Should put a new key and value in the flat instance's data.", () => {
      let statham = new Statham({"food.bacon.taste": 'good'}, Statham.MODE_FLAT);
      statham.put('food.bacon.whatevs', 'ok');

      assert.strictEqual(statham.data['food.bacon.whatevs'], 'ok', 'Key and value not set properly.');
    });

    it("Should return the modified instance.", () => {
      let statham = new Statham({food: {bacon: {}}});
      statham.put('food.bacon.whatevs', 'ok');

      assert.strictEqual(statham.data, statham.data, "It does not return the intance's data.");
    });
  });

  describe('.remove()', () => {
    it("Should remove the given key from nested intance's data.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});
      statham.remove('food.bacon.taste');

      assert.notDeepProperty(statham.data, 'food.bacon.taste', 'It did not remove the given key.');
    });

    it("Should return 'undefined' if the given key is invalid.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});
      statham.remove('food.apple');

      assert.isUndefined(statham.remove('food.apple'), 'It did not return "undefined".');
    });
  });
});
