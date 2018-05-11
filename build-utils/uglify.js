const gulp = require('gulp');
const pkg = require('../package.json'); // bring in properties specified in package.json
const customPlumber = require('./custom-plumber');
const banner = require('./banner');
const $ = require('./gulp-load-plugins');

/**
 * @param {string} src: input concat path string
 * @param {string} dest: output path
 * @param {string} fileName: concat file name
 * @param {string} taskName: name of the task
 * @param {string} newerDest: target file for newer to compared against
 */

function uglifyNewer (src, dest, taskName, newerDest) {
	return gulp.src(src)
			.pipe(customPlumber(`Error Running ${taskName} task`))
			.pipe($.sourcemaps.init({loadMaps:true}))
			// .pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({dest: newerDest})) //if build concat file is newer than dist file, then uglify
			// .pipe($.debug({title: 'Passed Through'})) // uncomment to see what files passed through
			.pipe(
					$.uglifyEs.default({
						output: { comments: $.uglifySaveLicense }
					})
							.on('error', (err) => {
								$.fancyLog($.ansiColors.red('[Error]'), err.toString()); //more detailed error message
								// this.emit('end');
							})
			)
			.pipe($.if([ '*.js', '!*.min.js' ],
					$.rename({ suffix: '.min' })
			))
			.pipe($.size({
				showFiles: true,
				gzip: true,
			}))
			.pipe($.header(banner, { pkg: pkg })) // add banner to minified file
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(dest));
}

module.exports = uglifyNewer;