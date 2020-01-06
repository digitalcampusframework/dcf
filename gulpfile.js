
const { watch, series, src, dest } = require('gulp');

// Import Gulp plugins.
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const scsslint = require('gulp-scss-lint');
const fs = require('fs');

function copyJS(cb) {
    // copy body-scroll-lock
    src('./node_modules/body-scroll-lock/lib/bodyScrollLock.es6.js')
      .pipe(rename('bodyScrollLock.js'))
      .pipe(dest('./js/es6/vendor'));

    src('./node_modules/body-scroll-lock/lib/bodyScrollLock.js')
      .pipe(dest('./js/transpiled/vendor'));


  // copy object-fit-images
  src('./node_modules/object-fit-images/dist/ofi.es-modules.js')
    .pipe(rename('ofi.js'))
    .pipe(dest('./js/es6/vendor'));

  src('./node_modules/object-fit-images/dist/ofi.common-js.js')
    .pipe(rename('ofi.js'))
    .pipe(dest('./js/transpiled/vendor'));

  src('./node_modules/object-fit-images/dist/ofi.min.js')
    .pipe(dest('./js/transpiled/vendor'));

    cb();
}

function lintJS(cb) {
  src('./js/es6/*.js')

    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    .pipe(eslint.format('checkstyle', fs.createWriteStream('jsLintReport.xml')))

    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());

    cb();
}

function transpileJS(cb) {
  src('./js/es6/*.js')

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
    .pipe(dest('./js/transpiled'));

    cb();
}

function lintSCSS(cb) {
  src('./scss/**/*.scss')
    .pipe(scsslint({
      'config': 'scssLint.yml',
      'reporterOutput': 'scssLintReport.json'
    }));

  cb();
}

exports.default = function() {
  // process JS and lint SCSS
  series(copyJS, lintJS, transpileJS, lintSCSS);

  // Watch SCSS and lint if changes occur
  watch('./scss/**/*.scss', { ignoreInitial: false }, lintSCSS);

  // Watch JS and process if changes occur
  watch('./js/es6/*.js', { ignoreInitial: false }, series(copyJS, lintJS, transpileJS));
};
