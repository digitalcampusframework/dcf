const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const buildNames = require('./build-names');


module.exports = {
	vendorJsSrc: path.join(buildPaths.vendorJsDest, buildNames.vendorJs),
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	scssDest: path.join(commonPaths.outputDist, 'scss')
};
