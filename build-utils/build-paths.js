const path = require('path');
const commonPaths = require('./common-paths');

const dialogPolyfill = require.resolve('dialog-polyfill');
const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, `${dialogPolyfill}`], // better to use unminified vendor files since all files will be concatenated & minified
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
};
