const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const appJsDestPath = path.join(commonPaths.outputBuild, 'js', 'app');
const commonAppPath = path.join(commonPaths.outputBuild, 'js', 'app','common');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app','optional');
const exampleScssSrcPath = path.join(commonPaths.examplePath, 'scss');
const coreDistCssPath = path.join(commonPaths.outputDist,'css');

//Obtain paths to dependencies from package
const dialogPolyfill = require.resolve('dialog-polyfill');
const intersectionObserver = require.resolve('intersection-observer');
const picturefill = require.resolve('picturefill');
const objectFitImages = require.resolve('object-fit-images');
const detailsPolyfill = require.resolve('details-polyfill');

// console.log([`${mustardJsSrcPath}/**/*.js`, `${picturefill}`, `${objectFitImages}`, detailsPolyfill]);
// TODO check to see if all the path properties are still being used

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	// better to use unminified vendor files since all files will be concatenated & minified
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`, dialogPolyfill, intersectionObserver],
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	// better to use unminified vendor files since all files will be concatenated & minified
	mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`, picturefill, objectFitImages, detailsPolyfill],
	mustardJsDest: path.join(commonPaths.outputBuild, 'js', 'mustard'),
	appJsPath: appJsSrcPath,
	appJsCommonSrc: path.join(appJsSrcPath, 'common'),
	appJsOptionalSrc: path.join(appJsSrcPath, 'optional'),
	appJsGlob: `${appJsSrcPath}/**/*.js`,
	appJsDest: appJsDestPath,
	appJSDestGlob: `${appJsDestPath}/**/*.js`,
	commonAppGlob: [`${commonAppPath}/**/*.js`, `!${commonAppPath}/${buildNames.appJs}`],
	commonAppDest: commonAppPath,
	optionaAppDest: optionalAppPath,
	// example theme related build paths
	exampleScssGlob: [`${exampleScssSrcPath}/**/*.scss`, ],
	exampleScssLintedDest: path.join(commonPaths.exampleBuild, 'scss'),
	exampleScreenScssEntry: path.join(commonPaths.exampleBuild,'scss','all.scss'),
	exampleMustardScssEntry: path.join(commonPaths.exampleBuild,'scss','mustard.scss'),
	examplePrintScssEntry: path.join(commonPaths.exampleBuild,'scss','print.scss'),
	exampleCompiledCssDir: path.join(commonPaths.exampleBuild,'css'),
	exampleScreenConcatGlob: [path.join(commonPaths.exampleBuild,'css','all.css'), `${coreDistCssPath}/screen/**/*.css`]
};
