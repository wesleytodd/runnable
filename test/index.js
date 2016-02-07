/* global describe, it*/
var spawn = require('child_process').spawn;
var assert = require('assert');
var path = require('path');

describe('runnable', function () {
	it('should execute if called directly', function (done) {
		var p = spawn('node', [path.join(__dirname, 'fixtures', 'index.js')]);

		p.stdout.on('data', function (d) {
			assert.equal(d.toString(), 'bar\n');
		});
		p.on('close', function () {
			done();
		});
	});

	it('should execute return if required', function (done) {
		var p = spawn('node', [path.join(__dirname, 'fixtures', 'other.js')]);

		p.stdout.on('data', function (d) {
			assert.equal(d.toString(), 'other\n');
		});
		p.on('close', function () {
			done();
		});
	});
});
