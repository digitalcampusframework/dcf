const path = require('path');

module.exports = {
	outputBuild: path.resolve(__dirname,'../assets','./build'),
	outputDist: path.resolve(__dirname,'../assets','./dist'),
	srcPath: path.resolve(__dirname,'../assets','./src'),
	distSrcPath:path.resolve(__dirname,'../assets','./build')
}