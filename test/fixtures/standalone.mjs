import runnable from '../../index.js';

export default runnable(function index (opts) {
  console.log(opts.foo);
}, [{
  foo: 'bar'
}]);
