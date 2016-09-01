var stack = require('callsite');

module.exports = function runnable (fnc, defaults, ctx) {
	var s = stack();
	// If called directly just run it with the defaults
	if (module.parent.filename === s[s.length - 1].getFileName()) {
		return fnc.apply(ctx || null, defaults || []);
	}

	// Loaded via require, so just return
	return fnc;
};
