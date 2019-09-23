const path = require('path');

module.exports = {
	outputBuild: path.resolve(__dirname,'../core','./build'),
	outputDist: path.resolve(__dirname,'../core','./dist'),
	srcPath: path.resolve(__dirname,'../core','./src'),
	distSrcPath:path.resolve(__dirname,'../core','./build'),
	logPath: path.resolve(__dirname, '../logs'),
	themePath: path.resolve(__dirname, '../theme'),
	themeBuild: path.resolve(__dirname, '../theme', './build')
}
