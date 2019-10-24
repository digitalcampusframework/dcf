const gulp = require('gulp');
const customPlumber = require('./custom-plumber');
const pkg = require('../package.json'); // bring in properties specified in package.json
const banner = require('./banner');

const $ = require('./gulp-load-plugins');
// postCSS plugins
const postcssCSSO = require('postcss-csso');

/**
 * @param {string} src: input concat path string
 * @param {string} dest: output path
 * @param {string} taskName: name of the task
 * @param {string} newerDest: target file for newer to compared against
 */

function cssMinifyNewer (src, dest, taskName, newerDest) {
  $.fancyLog('----> //** minify CSS files');
  return $.pump([
    gulp.src(src),
    customPlumber(`Error Running ${taskName}`),
    $.newer(newerDest),
    $.sourcemaps.init({loadMaps: true}),
    $.postcss(
      [
        postcssCSSO({
          comments: false,
        })
      ]
    ),
    $.if([ '*.css', '!*.min.css' ],
      $.rename({ suffix: '.min' })
    ),
    $.header(banner, { pkg: pkg }),
    $.size({
      showFiles: true,
      gzip: true,
    }),
    $.sourcemaps.write('./'),
    gulp.dest(dest)
  ]);
}

module.exports = cssMinifyNewer;
