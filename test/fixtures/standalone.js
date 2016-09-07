var runnable = require('../../');

module.exports = runnable(function index (opts) {
	console.log(opts.standalone);
}, [{
	standalone: 'foobar'
}]);
