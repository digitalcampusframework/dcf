const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const commonAppPath = path.join(commonPaths.outputBuild, 'js', 'app','common');
const exampleScssSrcPath = path.join(commonPaths.examplePath, 'scss');

//Obtain paths to dependencies from package
const dialogPolyfill = require.resolve('dialog-polyfill');
const intersectionObserver = require.resolve('intersection-observer');
const picturefill = require.resolve('picturefill');
const objectFitImages = require.resolve('object-fit-images');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	// better to use unminified vendor files since all files will be concatenated & minified
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, `${dialogPolyfill}`, `${intersectionObserver}`],
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	// better to use unminified vendor files since all files will be concatenated & minified
	mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`, `${picturefill}`, `${objectFitImages}`],
	mustardJsDest: path.join(commonPaths.outputBuild, 'js', 'mustard'),
	appJsPath: appJsSrcPath,
	appJsGlob: `${appJsSrcPath}/**/*.js`,
	appJsDest: path.join(commonPaths.outputBuild, 'js', 'app'),
	commonAppGlob: [`${commonAppPath}/**/*.js`, `!${commonAppPath}/${buildNames.appJs}`],
	commonAppDest: commonAppPath,
	exampleScssGlob: [`${exampleScssSrcPath}/**/*.scss`, ],
	exampleScssLintedDest: path.join(commonPaths.exampleBuild, 'scss'),
	exampleScreenScssEntry: path.join(commonPaths.exampleBuild,'scss','all.scss'),
	exampleMustardScssEntry: path.join(commonPaths.exampleBuild,'scss','mustard.scss'),
	examplePrintScssEntry: path.join(commonPaths.exampleBuild,'scss','print.scss'),
	exampleScreenScssWatchGlob: [`${exampleScssSrcPath}/**/*.scss`, `!${exampleScssSrcPath}/mustard/**/*.scss`, `!${exampleScssSrcPath}/print/**/*.scss`],
	exampleMustardScssWatchGlob: `${exampleScssSrcPath}/mustard/**/*.scss`,
	examplePrintScssWatchGlob: `${exampleScssSrcPath}/print/**/*.scss`,
	exampleCompiledCss: path.join(commonPaths.exampleBuild,'css')
};
