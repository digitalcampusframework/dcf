
const { src, dest } = require('gulp');

// Import Gulp plugins.
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
//const scsslint = require('gulp-scss-lint');

exports.default = function(done) {
  return src('./js/es6/**/*.js')

    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    //.pipe(eslint.failAfterError())

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
};