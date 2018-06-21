const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const commonAppPath = path.join(commonPaths.outputBuild, 'js', 'app','common');

//Load in dependencies from package
const dialogPolyfill = require.resolve('dialog-polyfill');
const picturefill = require.resolve('picturefill');
const objectFitImages = require.resolve('object-fit-images');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	// better to use unminified vendor files since all files will be concatenated & minified
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, `${dialogPolyfill}`],
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	// better to use unminified vendor files since all files will be concatenated & minified
	mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`, `${picturefill}`, `${objectFitImages}`],
	mustardJsDest: path.join(commonPaths.outputBuild, 'js', 'mustard'),
	appJsPath: appJsSrcPath,
	appJsGlob: `${appJsSrcPath}/**/*.js`,
	appJsDest: path.join(commonPaths.outputBuild, 'js', 'app'),
	commonAppGlob: [`${commonAppPath}/**/*.js`, `!${commonAppPath}/${buildNames.appJs}`],
	commonAppDest: commonAppPath
};
