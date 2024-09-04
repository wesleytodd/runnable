const runnable = require('../../');
const index = require('./index');

module.exports = runnable(function multiple (opts) {
  console.log(opts.beep);
  index({
    foo: 'fop'
  });
}, [{
  beep: 'boop'
}], module);
