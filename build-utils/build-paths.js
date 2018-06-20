const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const commonAppPath = path.join(commonPaths.outputBuild, 'js', 'app','common');

const dialogPolyfill = require.resolve('dialog-polyfill');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, `${dialogPolyfill}`], // better to use unminified vendor files since all files will be concatenated & minified
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`], // better to use unminified vendor files since all files will be concatenated & minified
	mustardJsDest: path.join(commonPaths.outputBuild, 'js', 'mustard'),
	appJsPath: appJsSrcPath,
	appJsGlob: `${appJsSrcPath}/**/*.js`,
	appJsDest: path.join(commonPaths.outputBuild, 'js', 'app'),
	commonAppGlob: [`${commonAppPath}/**/*.js`, `!${commonAppPath}/${buildNames.appJs}`],
	commonAppDest: commonAppPath
};
