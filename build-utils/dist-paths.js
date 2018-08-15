const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const buildNames = require('./build-names');

const scssPath = path.join(commonPaths.srcPath, 'scss');
const cssPath = path.join(commonPaths.srcPath, 'css');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app', 'optional');
const coreDistScssPath = path.join(commonPaths.outputDist, 'scss');
const exampleScssSrcPath = path.join(commonPaths.examplePath, 'scss');

module.exports = {
	vendorJsSrc: path.join(buildPaths.vendorJsDest, buildNames.vendorJs),
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	mustardJsSrc: path.join(buildPaths.mustardJsDest, buildNames.mustardJs),
	mustardJsDest: path.join(commonPaths.outputDist, 'js', 'mustard'),
	scssPath: scssPath,
	scssGlob: `${scssPath}/**/*.scss`,
	scssDest: coreDistScssPath,
	cssPath: cssPath,
	cssGlob: `${cssPath}/**/*.css`,
	cssDest: path.join(commonPaths.outputDist, 'css'),
	optionalAppGlob: `${optionalAppPath}/**/*.js`,
	optionalAppDest: path.join(commonPaths.outputDist,'js', 'app', 'optional'),
	// commonAppSrc: path.join(buildPaths.commonAppDest, buildNames.appJs),
	commonAppDest: path.join(commonPaths.outputDist, 'js', 'app', 'common'),
	appSrc: buildPaths.appJsDestPreBabel,
	appSrcGlob: `${buildPaths.appJsDestPostBabel}/**/*.js`,
	appDest: path.join(commonPaths.outputDist, 'js', 'app'),

	exampleScreenCssSrc: path.join(buildPaths.exampleCompiledCssDir, buildNames.exampleScreenCSS),
	exampleScreenCssDest: path.join(commonPaths.examplePath, 'css'),
	exampleScreenScssWatchGlob: [
			`${exampleScssSrcPath}/**/*.scss`,
			`!${exampleScssSrcPath}/mustard.scss`,
			`!${exampleScssSrcPath}/mustard/**/*.scss`,
			`!${exampleScssSrcPath}/print.scss`,
			`!${exampleScssSrcPath}/print/**/*.scss`
	],
	exampleScreenCoreScssWatchGlob:[
			`${coreDistScssPath}/**/*.scss`,
			`!${coreDistScssPath}/mustard/**/*.scss`,
			`!${coreDistScssPath}/print/**/*.scss`
	],

	exampleMustardScssWatchGlob: `${exampleScssSrcPath}/mustard/**/*.scss`,
	examplePrintScssWatchGlob: `${exampleScssSrcPath}/print/**/*.scss`,
};
