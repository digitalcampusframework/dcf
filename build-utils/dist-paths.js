const path = require('path');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const scssPath = path.join(commonPaths.srcPath, 'scss');
const cssPath = path.join(commonPaths.srcPath, 'css');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app', 'optional');
const coreDistScssPath = path.join(commonPaths.outputDist, 'scss');
const exampleScssSrcPath = path.join(commonPaths.examplePath, 'scss');

//Obtain paths to dependencies from package

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	// better to use unminified vendor files since all files will be concatenated & minified
	vendorJsGlob: [`${vendorJsSrcPath}/**/*`, `!${vendorJsSrcPath}/**/*.ts`],
	vendorJsDest: path.join(commonPaths.outputDist, 'js', 'vendor'),
	mustardJsSrc: [`${buildPaths.mustardJsDest}/**/*.js`, `!${buildPaths.mustardJsDest}/**/*.min.js`],
	mustardJsDest: path.join(commonPaths.outputDist, 'js', 'mustard'),
	scssPath: scssPath,
	scssGlob: `${scssPath}/**/*.scss`,
	scssDest: coreDistScssPath,
	cssPath: cssPath,
	cssGlob: `${cssPath}/**/*.css`,
	cssDest: path.join(commonPaths.outputDist, 'css'),
	optionalAppDest: path.join(commonPaths.outputDist,'js', 'app', 'optional'),
	commonAppDest: path.join(commonPaths.outputDist,'js', 'app', 'common'),
	appSrc: buildPaths.appJsDestPreBabel,
	appSrcGlob: `${buildPaths.appJsDestPostBabel}/**/*.js`,
	appDest: path.join(commonPaths.outputDist, 'js', 'app'),
	appDestPreBabel: path.join(commonPaths.outputDist, 'js', 'app', 'preBabel'),
	appDestPostBabel: path.join(commonPaths.outputDist, 'js', 'app', 'postBabel'),

	exampleScreenCssSrc: path.join(buildPaths.exampleCompiledCssDir, buildNames.exampleScreenCSS),
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

	examplePrintCssSrc: path.join(buildPaths.exampleCompiledCssDir, buildNames.examplePrintCSS),
	examplePrintScssWatchGlob: `${exampleScssSrcPath}/print/**/*.scss`,
	examplePrintCoreScssWatchGlob: `${coreDistScssPath}/print/**/*.scss`,

	exampleCssMinDest: path.join(commonPaths.examplePath, 'css'),
};
