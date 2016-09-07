var fs = require('fs');
var path = require('path');
module.exports = fs.readFileSync(path.join(__dirname, 'browserify-prelude.tmpl'), 'utf8');
