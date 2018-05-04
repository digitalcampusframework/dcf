/**
 * ------------------
 * SETTING UP GULP
 * ------------------
 */
const pkg = require('./package.json'); // bring in properties specified in package.json
const gulp = require('gulp');
const path = require('path');
const commonPaths = require('./build-utils/common-paths');
const buildPaths = require('./build-utils/build-paths');
const buildNames = require('./build-utils/build-names');
const distPaths = require('./build-utils/dist-paths');
const distNames = require('./build-utils/dist-names');

// load all plugins in "devDependencies" into the variable $
const $ = require('gulp-load-plugins')({
  pattern: [ '*' ],
  scope: [ 'devDependencies' ]
});

// log error messages
function customPlumber(errTitle) {
  return $.plumber({
    errorHandler: $.notify.onError({
      // Customizing error title
      title: errTitle || 'Error running Gulp',
      message: 'Error: <%= error.message %>',
      sound: 'Pop'
    })
  });
}

const banner = [
  '/**',
  ' * @project        <%= pkg.name %>',
  ' * @author         <%= pkg.author %>',
  ` * @copyright      Copyright (c) ${ $.moment().format('YYYY') }, <%= pkg.license %>`,
  ' *',
  ' */',
  ''
].join('\n');


/**
 * ------------
 * GULP TASKS
 * ------------
 */
gulp.task('vendorBuild', () => {
	$.fancyLog('----> //** Concatenating Vendor JS Files');
	return gulp.src(buildPaths.vendorJsGlob)
			.pipe($.sourcemaps.init())
			.pipe(customPlumber('Error Running vendorBuild task'))
			// .pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({dest: path.join(buildPaths.vendorJsDest, buildNames.vendorJs)}
			))
			// .pipe($.debug({title: 'Passed Through'})) //uncomment to see what files passed through
			.pipe($.concat(
					{path: buildNames.vendorJs},
					{newLine: '\n\n'}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(buildPaths.vendorJsDest));

});

gulp.task('vendorUglify', () => {
	$.fancyLog('----> //** Building Dist Vendor JS Files');

	return gulp.src(distPaths.vendorJsSrc)
			.pipe(customPlumber('Error Running vendorDist task'))
			.pipe($.sourcemaps.init({loadMaps:true}))
			// .pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({dest: path.join(distPaths.vendorJsDest, distNames.vendorMinJs)})) //if build concat file is newer than dist file, then uglify
			.pipe($.debug({title: 'Passed Through'})) // uncomment to see what files passed through
			.pipe(
					$.uglifyEs.default({
						output: {
							comments: $.uglifySaveLicense
							// TODO: add mangle!!!!!!
						}
					})
							.on('error', (err) => {
								$.fancyLog($.ansiColors.red('[Error]'), err.toString()); //more detailed error message
								this.emit('end');
							})
			)
			.pipe($.if([ '*.js', '!*.min.js' ],
					$.rename({ suffix: '.min' })
			))
			.pipe($.size({
				showFiles: true,
				gzip: true,
			}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(distPaths.vendorJsDest));
});

gulp.task('vendorDistOld', () => {
	$.fancyLog('----> //** Building Dist Vendor JS Files');

	return gulp.src(distPaths.vendorJsGlob)
			.pipe(customPlumber('Error Running vendorDist task'))
			.pipe($.sourcemaps.init())
			// .pipe($.debug({title: 'All Files'})) // uncomment to see src files
			//if build concat file is newer then just uglify concat file, otherwise reconcat then uglify
			.pipe($.newer({dest: path.join(distPaths.vendorJsDest, distNames.vendorMinJs)}))
			// .pipe($.debug({title: 'Passed Through'})) // uncomment to see if files are processed if min file is newer than src files
			.pipe($.concat(distNames.vendorMinJs))
			.pipe(
					$.uglifyEs.default({
						output: {
							comments: $.uglifySaveLicense
							// TODO: add mangle!!!!!!
						}
					})
						.on('error', (err) => {
							$.fancyLog($.ansiColors.red('[Error]'), err.toString()); //more detailed error message
							this.emit('end');
						})
			)
			.pipe($.size({
				showFiles: true,
				gzip: true,
				showTotal: true
			}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(distPaths.vendorJsDest));
});

gulp.task('copySass', () => {
	$.fancyLog('----> //** Copying SCSS files');

	return gulp.src(buildPaths.scssGlob)
			.pipe(gulp.dest(distPaths.scssDest));
});


/* ----------------- */
/* MISC GULP TASKS
/* ----------------- */
// output plugin names in terminal
gulp.task('outputPlugins', () => {
	console.log($);
});



/**
 * ------------------------
 * COMPOSING GULP TASKS
 * ------------------------
 */

gulp.task('vendorDist', gulp.series('vendorBuild', 'vendorUglify'));