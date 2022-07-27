/* eslint-disable no-console */

const { watch, src } = require('gulp');

// Import Gulp plugins.
const eslint = require('gulp-eslint');
const stylelint = require('stylelint');
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
  stylelint.lint({
    files: config.scssSrc,
    formatter: 'string', console: true
  }).then((data) => { 
    if (data.output) {
      fs.writeFile('scssLintReport.txt', data.output, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    cb();
  }).catch((err) => {
    console.error(err.stack);
    cb(err);
  });
}

exports.styles = lintSCSS;
exports.scripts = lintJS;
exports.default = function() {
  // Watch SCSS and lint if changes occur
  watch(config.scssSrc, { ignoreInitial: false }, exports.styles);

  // Watch JS and process if changes occur
  watch(config.jsSrc, { ignoreInitial: false }, exports.scripts);
};
