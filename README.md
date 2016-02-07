# Export a runnable function

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/wesleytodd/runnable.svg?branch=master)](https://travis-ci.org/wesleytodd/runnable)
[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)

[npm-image]: https://img.shields.io/npm/v/runnable.svg
[npm-url]: https://npmjs.org/package/runnable
[downloads-image]: https://img.shields.io/npm/dm/runnable.svg
[downloads-url]: https://npmjs.org/package/runnable

Wraps a function so that it is called when run directly but returned when required in.  This is especially useful for micro services and and SOA architectures, but can be used for many other things.

## Usage

```
$ npm install runnable
```

```javascript
// index.js

var runnable = require('runnable');

module.exports = runnable(function (opts) {
	console.log(opts.foo);
}, [{
	foo: 'bar'
}]); // bar
```

```javascript
// bin/foo.js

var foo = require('../index.js');

foo({
	foo: 'other bar'
}); // other bar
```

### API

```javascript
runnable(fnc <Function>[,defaults <Array>[, context <Any>]]);
```

- `fnc`: The runnable function
- `defaults`: Defaults that will be passed to the function when called directly
- `context`: The context the function will be called with (ex: `fnc.apply(ctx, defaults)`)

## Usage in micro-services/SOA

This is an example of how we use this pattern to give production configuration to apps in our SOA setup.  In development we just run `node index.js`, and in prod we run `./bin/server` which loads production configuration and registers with our service discovery.

```javascript
// ./index.js

var app = require('express')();
var runnable = require('runnable');

module.exports = runnable(function (opts) {
	var server = app.listen(opts.port, function () {
		console.log('Listening on ' + server.addresS().port);
	});
}, [{
	port: 4000
}]);
```

```javascript
// ./bin/server

var app = require('../');
app({
	port: null // run on a ephemeral port in production
});
```
