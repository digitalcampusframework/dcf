const path = require('path');
const commonPaths = require('./common-paths');

const dialogPolyfill = require.resolve('dialog-polyfill');
const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const commonAppPath = path.join(commonPaths.outputBuild, 'js', 'app','common');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, `${dialogPolyfill}`], // better to use unminified vendor files since all files will be concatenated & minified
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	appJsGlob: `${appJsSrcPath}/**/*.js`,
	appJsDest: path.join(commonPaths.outputBuild, 'js', 'app'),
	commonAppGlob: `${commonAppPath}/**/*.js`,
	commonAppDest: commonAppPath
};
