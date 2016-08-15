# json-statham
[![Build Status](https://travis-ci.org/SpoonX/json-statham.svg?branch=master)](https://travis-ci.org/SpoonX/json-statham)

Kick your JSON's ass, with json-statham's help. Extends [Homefront](https://github.com/SpoonX/homefront).

![Statham is awesome man](./stathams.jpg)

Makes working with javascript objects and json easy.

## Installation
`npm i --save json-statham`

## Tests
`npm test`

## Usage
This module extends [Homefront](https://github.com/SpoonX/homefront). It's essentially the same, except for some additional methods, and an extended constructor.

### Using Statham
All arguments are optional.

```js
let Statham = require('json-statham').Statham;
let statham = new Statham({data: 'here'}, Statham.MODE_NESTED, 'path/to/file');
```

### Using .setFileLocation()
```js
let Statham = require('json-statham').Statham;
let statham = new Statham();

statham.setFileLocation('./foo/ray-liotta.json'); // Used by .save()
```

### Using .save()
```js
let Statham = require('json-statham').Statham;
let statham = new Statham();

statham.save().then(() => {/* Really does return a promise, I promise. */});
statham.save('./json-flemyng.json');        // Specific file
statham.save(true);                         // Create path for file, too
statham.save('./matt-schulze.json', true);  // Both options
```

### Using .fromFile() 
This method allows you to tell Statham to fetch the contents of a file itself. This method returns a promise, and resolves with a statham instance (as described above).

```js
let Statham = require('json-statham').Statham;

Statham.fromFile(__dirname + '/my-data.json').then(statham => {
  // Yeeeaaah, we have a statham instance now.
});
```

