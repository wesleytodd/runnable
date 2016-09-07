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

Basic usage:

```javascript
// index.js

var runnable = require('runnable');

module.exports = runnable(function (opts) {
	console.log(opts.foo);
}, [{
	foo: 'bar'
}], module); // bar
```

```javascript
// bin/foo.js

var foo = require('../index.js');

foo({
	foo: 'other bar'
}); // other bar
```

Usage with multiple runnable instances in one process is a little bit different due to the behavior
of node's `module.parent` implementation which sets the parent to the first module to import
the file, as opposed to the actual parent which required it in this time.  So to work in this 
kind of an enviornment you need to pass a final parameter to the runnable call.

```javascript
var runnable = require('runnable');

module.exports = runnable(function foo () {
	console.log('foo');
}, module);
```

```javascript
var runnable = require('runnable');

module.exports = runnable(function bar () {
	console.log('bar');
}, module);
```

```javascript
var foo = require('../foo.js');
var bar = require('../bar.js');

foo(); // foo
bar(); // bar
```

## Usage with Browserify

If you are using this module with browserify, it will not work by default.  Browserify does 
not implement `module.parent` or `require.main`.  Luckily Browserify allows you to provide your
own require implementation via the `prelude` option.  This module comes with an implementation 
which implements the required fields.  Hopefully this will get added so Browserify once I make 
the case.  In the mean time you can do this:

```
var b = browserify('index.js', {
	prelude: require('runnable/browserify-prelude')
}).bundle();
```

### API

```javascript
runnable(fnc <Function>[,defaults <Array>[, module <Object>]]);
```

- `fnc`: The runnable function
- `defaults`: Defaults that will be passed to the function when called directly
- `module`: The module the function is declared in, literally `module` from the commonjs file

## Usage in micro-services/SOA

This is an example of how we use this pattern to give production configuration to apps in our SOA setup.  In development we just run `node index.js`, and in prod we run `./bin/server` which loads production configuration and registers with our service discovery.

```javascript
// index.js

var app = require('express')();
var runnable = require('runnable');

module.exports = runnable(function (opts) {
	var server = app.listen(opts.port, function () {
		console.log('Listening on ' + server.addresS().port);
	});
}, [{
	port: 4000
}], module);
```

```javascript
// bin/server

var app = require('../');
app({
	port: null // run on a ephemeral port in production
});
```
