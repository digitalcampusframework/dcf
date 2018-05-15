const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const buildNames = require('./build-names');

const scssPath = path.join(commonPaths.srcPath, 'scss');
const cssPath = path.join(commonPaths.srcPath, 'css');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app', 'optional');

module.exports = {
	vendorJsSrc: path.join(buildPaths.vendorJsDest, buildNames.vendorJs),
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	mustardJsSrc: path.join(buildPaths.mustardJsDest, buildNames.mustardJs),
	mustardJsDest: path.join(commonPaths.outputDist, 'js', 'mustard'),
	scssPath: scssPath,
	scssGlob: `${scssPath}/**/*.scss`,
	scssDest: path.join(commonPaths.outputDist, 'scss'),
	cssPath: cssPath,
	cssGlob: `${cssPath}/**/*.css`,
	cssDest: path.join(commonPaths.outputDist, 'css'),
	optionalAppGlob: `${optionalAppPath}/**/*.js`,
	optionalAppDest: path.join(commonPaths.outputDist,'js', 'app', 'optional'),
	commonAppSrc: path.join(buildPaths.commonAppDest, buildNames.appJs),
	commonAppDest: path.join(commonPaths.outputDist, 'js', 'app', 'common')
};
