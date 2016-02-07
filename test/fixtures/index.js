var runnable = require('../../');

module.exports = runnable(function (opts) {
	console.log(opts.foo);
}, [{
	foo: 'bar'
}]);
