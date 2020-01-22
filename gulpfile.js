
const { watch, src } = require('gulp');

// Import Gulp plugins.
const eslint = require('gulp-eslint');
const scsslint = require('gulp-scss-lint');
const fs = require('fs');

const config = {
  scssSrc:            './scss/**/*.scss',
  jsSrc:              './js/**/*.js'
};

function lintJS(cb) {
  src(config.jsSrc)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format('checkstyle', fs.createWriteStream('jsLintReport.xml')));

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

exports.styles = lintSCSS;
exports.scripts = lintJS;
exports.default = function() {
  // Watch SCSS and lint if changes occur
  watch(config.scssSrc, { ignoreInitial: false }, exports.styles);

  // Watch JS and process if changes occur
  watch(config.jsSrc, { ignoreInitial: false }, exports.scripts);
};
