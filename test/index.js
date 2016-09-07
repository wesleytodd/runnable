/* global describe, it, afterEach */
var spawn = require('child_process').spawn;
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');

var index = path.join(__dirname, 'fixtures', 'index.js');
var other = path.join(__dirname, 'fixtures', 'other.js');
var multiple = path.join(__dirname, 'fixtures', 'multiple.js');
var standalone = path.join(__dirname, 'fixtures', 'standalone.js');
var tmp = path.join(__dirname, 'fixtures', 'tmp.js');

// Custom browserify prefix
var prelude = require('../browserify-prelude');

function bundle (path, done) {
	var b = browserify(path, {
		node: true,
		prelude: prelude
	}).bundle();
	b.on('end', function () {
		done();
	});
	b.pipe(fs.createWriteStream(tmp));
}

function runBundle (path, onData, done) {
	var p = spawn('node', [path]);
	var ran = false;
	var data = new Buffer('');
	p.stdout.on('data', function (d) {
		ran = true;
		data = Buffer.concat([data, d]);
	});
	p.on('close', function () {
		onData(data);
		assert(ran);
		done();
	});
}

describe('runnable', function () {
	afterEach(function () {
		try {
			fs.unlinkSync(tmp);
		} catch (e) {
			// Ignore errors
		}
		/**/
	});

	it('should execute if called directly', function (done) {
		runBundle(index, function (d) {
			assert.equal(d.toString(), 'bar\n');
		}, done);
	});

	it('should execute return if required', function (done) {
		runBundle(other, function (d) {
			assert.equal(d.toString(), 'other\n');
		}, done);
	});

	it('should execute with multiple runnables in a single app', function (done) {
		runBundle(multiple, function (d) {
			assert.equal(d.toString(), 'boop\nfop\n');
		}, done);
	});

	it('should execute when not passed a module', function (done) {
		runBundle(standalone, function (d) {
			assert.equal(d.toString(), 'foobar\n');
		}, done);
	});

	it('should work when called directly in a browserified bundle', function (done) {
		bundle(index, function () {
			runBundle(tmp, function (d) {
				assert.equal(d.toString(), 'bar\n');
			}, done);
		});
	});

	it('should work when required in a browserified bundle', function (done) {
		bundle(other, function () {
			runBundle(tmp, function (d) {
				assert.equal(d.toString(), 'other\n');
			}, done);
		});
	});

	it('should work when required in a browserified bundle with multiple runnables', function (done) {
		bundle(multiple, function () {
			runBundle(tmp, function (d) {
				assert.equal(d.toString(), 'boop\nfop\n');
			}, done);
		});
	});
});
