const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const vendorJsSrcPath = path.join(commonPaths.srcPath, 'js', 'vendor');
const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const appJsDestPath = path.join(commonPaths.outputBuild, 'js', 'app');
const appJsDestPathPreBabel = path.join(appJsDestPath, 'preBabel');
const appJsDestPathPostBabel = path.join(appJsDestPath, 'postBabel');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app','optional');
const exampleScssSrcPath = path.join(commonPaths.examplePath, 'scss');
const coreDistCssPath = path.join(commonPaths.outputDist,'css');

//Obtain paths to dependencies from package
const dialogPolyfill = require.resolve('dialog-polyfill');
const objectFitImages = require.resolve('object-fit-images/dist/ofi.js');
const detailsPolyfill = require.resolve('details-polyfill');

module.exports = {
	vendorJsSrc: vendorJsSrcPath,
	// better to use unminified vendor files since all files will be concatenated & minified
	vendorJsGlob: [`${vendorJsSrcPath}/**/*.js`],
	vendorJsDest: path.join(commonPaths.outputBuild, 'js', 'vendor'),
	// better to use unminified vendor files since all files will be concatenated & minified
	mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`, objectFitImages, detailsPolyfill, dialogPolyfill],
	mustardJsDest: path.join(commonPaths.outputBuild, 'js', 'mustard'),
	appJsPath: appJsSrcPath,
	appJsCommonSrc: path.join(appJsSrcPath, 'common'),
	appJsOptionalSrc: path.join(appJsSrcPath, 'optional'),
	appJsSrcGlob: `${appJsSrcPath}/**/*.js`,
	appJsDestPreBabel: appJsDestPathPreBabel,
	babelAppGlob: `${appJsDestPathPreBabel}/**/*.js`,
	appJsDestPostBabel: appJsDestPathPostBabel,
	appJsDestPostBabelGlob: `${appJsDestPathPostBabel}/**/*.js`,
	umdCommonAppDest: path.join(appJsDestPathPreBabel, 'common'),
	umdOptionaAppDest: path.join(appJsDestPathPreBabel, 'optional'),

	// example theme related build paths
	exampleScssGlob: [`${exampleScssSrcPath}/**/*.scss`, ],
	exampleScssLintedDest: path.join(commonPaths.exampleBuild, 'scss'),
	exampleScreenScssEntry: path.join(commonPaths.exampleBuild,'scss', buildNames.exampleScreenSCSS),
	exampleMustardScssEntry: path.join(commonPaths.exampleBuild,'scss',buildNames.exampleMustardSCSS),
	examplePrintScssEntry: path.join(commonPaths.exampleBuild,'scss',buildNames.examplePrintSCSS),
	exampleCompiledCssDir: path.join(commonPaths.exampleBuild,'css'),
	exampleScreenConcatGlob: [path.join(commonPaths.exampleBuild,'css', buildNames.exampleScreenCSS), `${coreDistCssPath}/screen/**/*.css`]
};
