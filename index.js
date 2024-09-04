// not using `node:url` because the old browserify tests dont support it
// probably consider breaking that? browserify is dead right?
const url = require('url');

module.exports = function runnable (fnc, defaults = [], ctx) {
  // Default context to the parent module
  ctx = ctx || module.parent;

  if (!ctx) {
    throw new TypeError('No module metadata. If using an ESM entry, pass import.meta');
  }

  // ESM is expected to pass in a import.meta object
  if (ctx.url) {
    if (ctx.url.startsWith('file:')) {
      if (process.argv[1] === url.fileURLToPath(ctx.url)) {
        return fnc(...defaults);
      }
    }
    return fnc;
  }

  // If called directly just run it with the defaults
  if (require.main === ctx || ctx.parent === null) {
    return fnc.apply((ctx && ctx.exports) || null, defaults);
  }

  // Loaded via require, so just return
  return fnc;
};
