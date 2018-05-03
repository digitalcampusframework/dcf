const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');


module.exports = {
	vendorJsGlob: buildPaths.vendorJsGlob,
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	scssDest: path.join(commonPaths.outputDist, 'scss')
};
