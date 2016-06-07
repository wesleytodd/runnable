module.exports = function runnable (fnc, defaults, ctx) {
	// If called directly just run it with the defaults
	if (module.parent && module.parent.parent === null) {
		return fnc.apply(ctx || null, defaults || []);
	}

	// Loaded via require, so just return
	return fnc;
};
