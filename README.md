# json-statham
[![Build Status](https://travis-ci.org/SpoonX/json-statham.svg?branch=master)](https://travis-ci.org/SpoonX/json-statham)

Kick your JSON's ass, with json-statham's help.

![Statham is awesome man](./stathams.jpg)

Makes working with javascript objects and json easy, in both the browser and on the server.

## Installation
`npm i --save json-statham`

## Tests
`npm test`

## Usage
Usage is pretty straight forward.

### Statham class

#### Creating an instance
```js
let Statham = require('json-statham').Statham;
let data    = require('./my-file.json');
let statham = new Statham(data, Statham.MODE_NESTED);

// Put a value.
statham.put('me', 'down');

// Fetch a value.
statham.fetch('me', 'default value');

// Remove a value.
statham.remove('me');

// Use dot-notation for nested objects.
statham.put('user.profile.username', 'Frank');
statham.fetch('user.profile.username');
statham.remove('user.profile.username');

// Merge new data into your object
statham.merge({override: 'something'}, {and: {add: {something: 'else'}}});

// And the same again, but with nested keys!
statham.merge(
  {'no.way.this.is.not.possible': 'right?', 'you.are.wrong': 'It is'},
  {mind: 'blown'},
  new Statham({andThis: 'also works'})
);

// Flatten object (nested objects to dot-notation keys):
statham.flatten();

// Expand object (dot-notation keys to nested objects):
statham.expand();

// (Server-side only!) Saving data to file (returns a promise):
statham.save().then(() => {/* Really does return a promise, I promise. */});
statham.save('./json-flemyng.json');        // Specific file
statham.save(true);                         // Create path for file, too
statham.save('./matt-schulze.json', true);  // Both options

// Helpers
statham.isModeFlat();
statham.isModeNested();
statham.getMode();
statham.setMode(Statham.MODE_FLAT);
statham.setFileLocation('./foo/ray-liotta.json');

// Constants
Statham.MODE_FLAT;
Statham.MODE_NESTED;
```

#### Using .fromFile() (server only)
This method allows you to tell Statham to fetch the contents of a file itself. This method returns a promise, and resolves with a statham instance (as described above).

```js
let Statham = require('json-statham').Statham;

Statham.fromFile(__dirname + '/my-data.json').then(statham => {
  // Yeeeaaah, we have a statham instance now.
});
```

### Expand
```js
let Statham  = require('json-statham').expand;
let data     = require('./my-file.json');
let expanded = expand(data);
```

### Flatten
```js
let Statham = require('json-statham').flatten;
let data    = require('./my-file.json');
let flatten = flatten(data);
```

## Building the code
For this code to work in the browser, there's an extra transpile step included.
Running this is as easy as executing the following command:

`npm run build`

The built code will appear in the dist directory.
