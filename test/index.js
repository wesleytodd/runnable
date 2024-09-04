'use strict';
const spawn = require('child_process').spawn;
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { it, describe, afterEach } = require('mocha');
const browserify = require('browserify');

const index = path.join(__dirname, 'fixtures', 'index.js');
const other = path.join(__dirname, 'fixtures', 'other.js');
const multiple = path.join(__dirname, 'fixtures', 'multiple.js');
const standalone = path.join(__dirname, 'fixtures', 'standalone.js');

const esmIndex = path.join(__dirname, 'fixtures', 'index.mjs');
const esmMultiple = path.join(__dirname, 'fixtures', 'multiple.mjs');
const esmStandalone = path.join(__dirname, 'fixtures', 'standalone.mjs');

const tmp = path.join(__dirname, 'fixtures', 'tmp.js');

// Custom browserify prefix
const prelude = require('../browserify-prelude');

function bundle (path, done) {
  const b = browserify(path, {
    node: true,
    prelude
  }).bundle();
  b.on('end', function () {
    done();
  });
  b.pipe(fs.createWriteStream(tmp));
}

function runBundle (path, onData, done) {
  const p = spawn('node', [path]);
  let ran = false;
  let data = Buffer.from('');
  let errData = Buffer.from('');
  p.stderr.on('data', function (d) {
    ran = true;
    errData = Buffer.concat([errData, d]);
  });
  p.stdout.on('data', function (d) {
    ran = true;
    data = Buffer.concat([data, d]);
  });
  p.on('close', function () {
    onData(data, errData);
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

  describe('ESM', function () {
    it('should execute if called directly', function (done) {
      runBundle(esmIndex, function (d) {
        assert.equal(d.toString(), 'bar\n');
      }, done);
    });

    it('should execute with multiple runnables in a single app', function (done) {
      runBundle(esmMultiple, function (d) {
        assert.equal(d.toString(), 'boop\nfop\n');
      }, done);
    });

    it('should throw when not passed an import.meta context', function (done) {
      runBundle(esmStandalone, function (stdout, stderr) {
        assert(stderr.includes('TypeError: No module metadata'));
        assert.equal(stdout.toString(), '');
      }, done);
    });
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
