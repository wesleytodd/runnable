import runnable from '../../index.js';
import index from './index.mjs';

export default runnable(function multiple (opts) {
  console.log(opts.beep);
  index({
    foo: 'fop'
  });
}, [{
  beep: 'boop'
}], import.meta);
