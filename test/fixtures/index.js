const runnable = require('../../');

module.exports = runnable(function index (opts) {
  console.log(opts.foo);
}, [{
  foo: 'bar'
}], module);
