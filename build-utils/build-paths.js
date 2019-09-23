const path = require('path');
const commonPaths = require('./common-paths');
const buildNames = require('./build-names');

const mustardJsSrcPath = path.join(commonPaths.srcPath, 'js', 'mustard');
const appJsSrcPath = path.join(commonPaths.srcPath, 'js', 'app');
const appJsDestPath = path.join(commonPaths.outputBuild, 'js', 'app');
const appJsDestPathPreBabel = path.join(appJsDestPath, 'preBabel');
const appJsDestPathPostBabel = path.join(appJsDestPath, 'postBabel');
const optionalAppPath = path.join(commonPaths.outputBuild, 'js', 'app','optional');
const themeScssSrcPath = path.join(commonPaths.themePath, 'scss');
const coreDistCssPath = path.join(commonPaths.outputDist,'css');

// Obtain paths to dependencies from package
const objectFitImages = require.resolve('object-fit-images/dist/ofi.js');


module.exports = {
  mustardJsGlob: [`${mustardJsSrcPath}/**/*.js`, objectFitImages],
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

  // Theme related build paths
  themeScssGlob: [`${themeScssSrcPath}/**/*.scss`, ],
  themeScssLintedDest: path.join(commonPaths.themeBuild, 'scss'),
  themeMainScssEntry: path.join(commonPaths.themeBuild,'scss', buildNames.themeMainSCSS),
  themeMustardScssEntry: path.join(commonPaths.themeBuild,'scss',buildNames.themeMustardSCSS),
  themePrintScssEntry: path.join(commonPaths.themeBuild,'scss',buildNames.themePrintSCSS),
  themeCompiledCssDir: path.join(commonPaths.themeBuild,'css'),
  themeMainConcatGlob: [path.join(commonPaths.themeBuild,'css', buildNames.themeMainCSS), `${coreDistCssPath}/screen/**/*.css`]
};
