"use strict";

let fs      = require('fs');
let assert  = require('chai').assert;
let flat    = require('./resources/flat.json');
let extend  = require('extend');
let nested  = require('./resources/nested.json');
let Statham = require('../index.js').Statham;
let tmpdir  = __dirname + '/.tmp';
let del     = require('del');

describe('Statham', () => {
  describe('static .fromFile()', () => {
    before(clear);
    after(clear);

    it('Should throw error if browser.', done => {
      global.window = true;

      return Statham.fromFile(__dirname + '/resources/nested.json')
        .then(() => {
          done(new Error('It did not throw exception.'));
        })
        .catch(exception => {
          assert.strictEqual(exception.message, 'Unsupported environment. For a browser-compatible version, go to https://www.npmjs.com/package/homefront');

          global.window = undefined;

          done();
        });
    });

    it('Should return a new Statham instance with the data from given file.', () => {
      return Statham.fromFile(__dirname + '/resources/nested.json').then(statham => {
        assert.instanceOf(statham, Statham, 'Not sure what happened here.');
      });
    });

    it('Should return a new Statham instance with the data from given file and given mode.', () => {
      let instanceCreationPromises = [
        Statham.fromFile(__dirname + '/resources/flat.json', Statham.MODE_FLAT),
        Statham.fromFile(__dirname + '/resources/nested.json', Statham.MODE_NESTED)
      ];

      return Promise.all(instanceCreationPromises).then(results => {
        assert.strictEqual(results[0].mode, Statham.MODE_FLAT, 'Mode is not flat.');
        assert.strictEqual(results[1].mode, Statham.MODE_NESTED, 'Mode is not nested.');
      });
    });

    it("Should set the file's path as the instance's `filePath`.", () => {
      return Statham.fromFile(__dirname + '/resources/nested.json').then(statham => {
        assert.strictEqual(statham.filePath, __dirname + '/resources/nested.json', '`filePath` not set.');
      });
    });
    
    it('Should create a new file if `ensure` is set to true', done => {
      return Statham.fromFile(tmpdir + '/no-such-file.json', null, true).then(() => {
        require(tmpdir + '/no-such-file.json');
        done();
      }).catch(done);
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

    it('Should accept filePath as third argument.', () => {
      let statham = new Statham({}, null, __dirname + 'file.json');

      assert.strictEqual(statham.filePath, __dirname + 'file.json', 'It did not accept or assign path.');
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

    it("Should return 'null' if the intance's mode is flat.", () => {
      let statham = new Statham({"food.bacon.taste": 'good'}, Statham.MODE_FLAT);

      assert.isNull(statham.fetch('food.bacon'), 'It did not return "null"');
    });

    it("Should return provided default value if not found.", () => {
      let statham = new Statham();

      assert.strictEqual(statham.fetch('food.bacon', 'I am default'), 'I am default');
    });

    it("Should not return if last segment of key matches.", () => {
      let statham = new Statham({foo: 'bar'});

      assert.strictEqual(statham.fetch('food.bacon.foo'), null);
    });

    it("Should function well for arrays.", () => {
      let statham = new Statham({foo: ['bar', 'bat']}, Statham.MODE_FLAT);

      assert.isNull(statham.fetch('foo.0'), 'bar');
      assert.isNull(statham.fetch('foo.1'), 'bat');
      assert.isNull(statham.fetch('foo.2'), null);
    });

    it("Should return 'null' if the key is invalid.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});

      assert.isNull(statham.fetch('food.apple'), 'It did not return "null".');
      assert.isNull(statham.fetch('food.apple.going.deeper'), 'It did not return "null".');
    });
  });

  describe('.merge()', () => {
    it('Should properly merge in data, converting flat to nested.', () => {
      let statham = new Statham(Object.assign({}, nested), Statham.MODE_NESTED);

      let expected = {};
      let v = {'bat.what.do.you.want': 'stuff'};
      let w = {'bat.space': 'exploration'};
      let x = {foo: 'kak', bat: {cake: 'lies', what: {test: 'is this'}}};
      let y = {bat: {cake: 'promise!', ja: 'man'}, meh: 'wut'};
      let z = {foo: 'bar', bat: {baz: 'bacon'}};

      statham.merge(v, w, x, y, z);

      assert.strictEqual(statham.data.bat.what.test, 'is this', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.bat.what.do.you.want, 'stuff', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.bat.space, 'exploration', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.bat.cake, 'promise!', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.bat.ja, 'man', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.foo, 'bar', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.food.bacon.taste, 'good', 'Merge did not work as expected.');
      assert.strictEqual(statham.data.cake, 'lie', 'Merge did not work as expected.');
    });

    it('Should merge statham instances.', () => {
      let statham    = new Statham({foo: 'bar', bacon: 'cake'});
      let stathamTwo = new Statham({foo: 'barz', topical: 'maybe'});

      assert.strictEqual(statham.merge(stathamTwo), statham);
      assert.strictEqual(statham.fetch('foo'), 'barz');
      assert.strictEqual(statham.fetch('bacon'), 'cake');
      assert.strictEqual(statham.fetch('topical'), 'maybe');
    });

    it('Should properly merge in data, converting nested to flat.', () => {
      let statham = new Statham(Object.assign({}, flat), Statham.MODE_FLAT);

      let expected = {};
      let v = {'bat.what.do.you.want': 'stuff'};
      let w = {'bat.space': 'exploration'};
      let x = {foo: 'kak', bat: {cake: 'lies', what: {test: 'is this'}}};
      let y = {bat: {cake: 'promise!', ja: 'man'}, meh: 'wut'};
      let z = {foo: 'bar', bat: {baz: 'bacon'}};

      statham.merge(v, w, x, y, z);

      assert.strictEqual(statham.data['bat.what.test'], 'is this', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['bat.what.do.you.want'], 'stuff', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['bat.space'], 'exploration', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['bat.cake'], 'promise!', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['bat.ja'], 'man', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['foo'], 'bar', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['food.bacon.taste'], 'good', 'Merge did not work as expected.');
      assert.strictEqual(statham.data['cake'], 'lie', 'Merge did not work as expected.');
    });

    it('Should not merge data when provided falsy value.', () => {
      let statham = new Statham({hello: 'world'});

      statham.merge();
      assert.deepEqual(statham.data, {hello: 'world'});
      statham.merge(null);
      assert.deepEqual(statham.data, {hello: 'world'});
    });

    it('Should return self.', () => {
      let statham = new Statham({hello: 'world'});

      assert.strictEqual(statham.merge({how: 'are you doing'}), statham, 'Merge did not return self.');
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

    it("Should put keys that aren't nested.", () => {
      let statham = new Statham({food: {bacon: {}}});
      statham.put('cake', 'lie');

      assert.strictEqual(statham.data.cake, 'lie', "It does not return the instance's data.");
    });

    it("Should put keys that are nested but don't exist yet.", () => {
      let statham = new Statham({food: {bacon: {}}});
      statham.put('a.b.c.d.e.f.g.h.i.l.k.j.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 'boop');

      assert.strictEqual(statham.data.a.b.c.d.e.f.g.h.i.l.k.j.m.n.o.p.q.r.s.t.u.v.w.x.y.z, 'boop');
    });

    it("Should return the modified instance's data.", () => {
      let statham = new Statham({food: {bacon: {}}});
      statham.put('food.bacon.whatevs', 'ok');

      assert.strictEqual(statham.data, statham.data, "It does not return the instance's data.");
    });
  });

  describe('.remove()', () => {
    it("Should remove the given key from nested intance's data.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});
      statham.remove('food.bacon.taste');

      assert.notDeepProperty(statham.data, 'food.bacon.taste', 'It did not remove the given key.');
    });

    it("Should return the modified instance's data.", () => {
      let statham = new Statham({food: {bacon: {taste: 'good'}}});

      assert.strictEqual(statham.remove('food.bacon').data, statham.data, 'It did not return the data.');
    });
  });

  describe('.setFileLocation()', () => {
    it('Should set the path of the file.', () => {
      let statham = new Statham({}, null);

      assert.strictEqual(statham.filePath, undefined, 'It did not set the path.');

      let result = statham.setFileLocation();

      assert.strictEqual(result, statham, 'It does not return this.');

      assert.strictEqual(statham.filePath, undefined, 'It did not set the path.');

      statham.setFileLocation('./derp');

      assert.strictEqual(statham.filePath, './derp', 'It did not set the path.');
    });
  });

  describe('.save()', () => {
    before(clear);
    after(clear);

    it('Should throw error if browser.', done => {
      let statham   = new Statham({});
      global.window = true;

      return statham.save()
        .then(() => {
          done(new Error('It did not throw exception.'));
        })
        .catch(exception => {
          assert.strictEqual(exception.message, 'Unsupported environment. For a browser-compatible version, go to https://www.npmjs.com/package/homefront');

          global.window = undefined;

          done();
        });
    });

    it('Should throw error if the path is undefined.', done => {
      let statham = new Statham({});

      return statham.save()
        .then(() => {
          done(new Error('It did not throw exception.'));
        })
        .catch(exception => {
          assert.strictEqual(exception.message, 'Path undefined.');

          done();
        }).catch(done);
    });

    it('Should create a new directory, if given path does not exist yet, and save.', done => {
      let fileName = tmpdir + '/rtfgbhn/sdfg/file.json';
      let statham  = new Statham({}, null, fileName);

      return statham.save(true).then(() => {
        require(fileName);
        done();
      }).catch(done);
    });

    it('Should throw an error if filePath is nested and createPath is undefined.', done => {
      let filePath = tmpdir + '/sajdha/askjdh';
      let statham  = new Statham({});

      return statham.save(filePath).then(() => {
        throw new Error('It did not throw an error.');
      }).catch(exception => {
        assert.strictEqual(exception.message, `ENOENT: no such file or directory, open '${filePath}'`);

        done();
      }).catch(done);
    });
  });

  describe('.search()', () => {
    it('Should return an array containing all matching values from flat data.', () => {
      let statham  = new Statham({"food.bacon.taste": "good", "fruit.and.stuff": "avocado", "water": "meh"},
        Statham.MODE_FLAT);
      let filtered = [{key: "food.bacon.taste", value: "good"}, {key: "fruit.and.stuff", value: "avocado"}];

      assert.deepEqual(statham.search('o'), filtered, 'It did not return a filtered object.');
    });

    it('Should return an array containing all matching values form nested data.', () => {
      let statham  = new Statham({food: {bacon: {taste: 'good', smell: 'true'}}, fruit: 'avocado'});
      let filtered = [{key: 'food.bacon.taste', value: 'good'}, {key: 'fruit', value: 'avocado'}];

      assert.deepEqual(statham.search('o'), filtered, 'It did not return a filtered object.');
    });

    it('Should return an empty array if no match is found.', () => {
      let statham = new Statham({"food.bacon.taste": "good", "fruit.and.stuff": "avocado", "water": "meh"},
        Statham.MODE_FLAT);

      assert.deepEqual(statham.search('banana'), [], 'It did not return an empty object.');
    });

    it('Should return the whole array as value if it contains a match.', () => {
      let statham  = new Statham({food: ['fries', 'pizza', 'babies'], fruit: ['avocado', 'apple']});
      let filtered = [{key: 'food', value: ['fries', 'pizza', 'babies']}];

      assert.deepEqual(statham.search('babies'), filtered, 'It did not return a filtered object.');
    });
  });
});

function clear(done) {
  del(tmpdir).then(() => {
    done();
  }).catch(done);
}
