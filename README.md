# json-statham
[![Build Status](https://travis-ci.org/SpoonX/json-statham.svg?branch=master)](https://travis-ci.org/SpoonX/json-statham)

Kick your JSON's ass, with json-statham's help.

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
statham.fetch('me');

// Remove a value.
statham.remove('me');

// Use dot-notation for nested objects.
statham.put('user.profile.username', 'Frank');
statham.fetch('user.profile.username');
statham.remove('user.profile.username');

// Flatten object (nested objects to dot-notation keys):
statham.flatten();

// Expand object (dot-notation keys to nested objects):
statham.expand();

// Helpers
statham.isModeFlat();
statham.isModeNested();
statham.getMode();
statham.setMode(Statham.MODE_FLAT);

// Constants
Statham.MODE_FLAT;
Statham.MODE_NESTED;
```

#### Using .fromFile()
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
