module.exports = function runnable (fnc, defaults, ctx) {
	// Default context to the parent module
	ctx = ctx || module.parent;

	// If called directly just run it with the defaults
	if (ctx.parent === null) {
		return fnc.apply((ctx && ctx.exports) || null, defaults || []);
	}

	// Loaded via require, so just return
	return fnc;
};
