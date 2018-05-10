const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const buildNames = require('./build-names');

const scssPath = path.join(commonPaths.srcPath, 'scss');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app', 'optional');

module.exports = {
	vendorJsSrc: path.join(buildPaths.vendorJsDest, buildNames.vendorJs),
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	scssGlob: `${scssPath}/**/*.scss`,
	scssDest: path.join(commonPaths.outputDist, 'scss'),
	optionalAppGlob: `${optionalAppPath}/**/*.js`,
	optionalAppDest: path.join(commonPaths.outputDist,'js', 'app', 'optional'),
	commonAppSrc: path.join(buildPaths.commonAppDest, buildNames.appJs),
	commonAppDest: path.join(commonPaths.outputDist, 'js', 'app', 'common')
};
