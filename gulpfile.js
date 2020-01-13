
const { watch, series, src, dest } = require('gulp');

// Import Gulp plugins.
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const scsslint = require('gulp-scss-lint');
const fs = require('fs');

const config = {
  scssSrc:            './scss/**/*.scss',
  jsSrc:              './js/es6/*.js',
  jsTranspiled:       './js/transpiled',
  jsES6Vendor:        './js/es6/vendor',
  jsTranspiledVendor: './js/transpiled/vendor'
};

function copyJS(cb) {
  // copy body-scroll-lock
  const bodyScrollLockSrc = './node_modules/body-scroll-lock/lib/';
  src(bodyScrollLockSrc + 'bodyScrollLock.es6.js')
    .pipe(rename('bodyScrollLock.js'))
    .pipe(dest(config.jsES6Vendor));

  src(bodyScrollLockSrc + 'bodyScrollLock.js')
    .pipe(dest(config.jsTranspiledVendor));

  // copy object-fit-images
  const objectFitImagesSrc = './node_modules/object-fit-images/dist/';
  src(objectFitImagesSrc + 'ofi.es-modules.js')
    .pipe(dest(config.jsES6Vendor));

  src(objectFitImagesSrc + 'ofi.common-js.js')
    .pipe(dest(config.jsTranspiledVendor));

  src(objectFitImagesSrc + 'ofi.min.js')
    .pipe(dest(config.jsTranspiledVendor));

  cb();
}

function lintJS(cb) {
  src(config.jsSrc)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format('checkstyle', fs.createWriteStream('jsLintReport.xml')))
    .pipe(eslint.failAfterError());

  cb();
}

function transpileJS(cb) {
  src(config.jsSrc)

    .pipe(plumber())
    // Transpile the JS code using Babel's preset-env.
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }))
    // Save each component as a separate file in js/transpiled.
    .pipe(dest(config.jsTranspiled));

    cb();
}

function lintSCSS(cb) {
  src(config.scssSrc)
    .pipe(scsslint({
      'config': 'scssLint.yml',
      'reporterOutput': 'scssLintReport.json'
    }));

  cb();
}

exports.default = function() {
  // Watch SCSS and lint if changes occur
  watch(config.scssSrc, { ignoreInitial: false }, lintSCSS);

  // Watch JS and process if changes occur
  watch(config.jsSrc, { ignoreInitial: false }, series(copyJS, lintJS, transpileJS));
};
