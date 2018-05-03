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
	$.fancyLog('----> Concatenating Files');
	console.log({buildPaths});
	return gulp.src(buildPaths.vendorJsGlob)
			.pipe(customPlumber('Error Running vendorBuild task'))
			.pipe($.newer({dest:buildPaths.vendorJsDest}
			))
			.pipe($.concat(
					{path: buildNames.vendorJs},
					{newLine: '\n\n'}))
			.pipe(gulp.dest(buildPaths.vendorJsDest));

});

gulp.task('vendorBuild', () => {
	$.fancyLog('----> //** Concatenating Vendor JS Files');
	return gulp.src(buildPaths.vendorJsGlob)
			.pipe(customPlumber('Error Running vendorBuild task'))
			.pipe($.newer({dest:buildPaths.vendorJsDest}
			))
			.pipe($.concat(
					{path: buildNames.vendorJs},
					{newLine: '\n\n'}))
			.pipe(gulp.dest(buildPaths.vendorJsDest));

});

gulp.task('vendorDist', () => {
	$.fancyLog('----> //** Building Dist Vendor JS Files');

	return gulp.src(distPaths.vendorJsGlob)
			.pipe(customPlumber('Error Running vendorDist task'))
			.pipe($.sourcemaps.init())
			// .pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({dest: path.join(distPaths.vendorJsDest, distNames.vendorMinJs)}))
			// .pipe($.debug({title: 'Passed Through'})) // uncomment to see if files are processed if min file is newer than src files
			.pipe($.concat(distNames.vendorMinJs))
			.pipe(
					$.uglifyEs.default({
						output: {
							comments: $.uglifySaveLicense
						}
					})
						.on('error', (err) => {
							$.fancyLog($.ansiColors.red('[Error]'), err.toString());
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
			.pipe(gulp.dest(buildPaths.scssDest))
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
 * REGISTERING GULP TASKS
 * ------------------------
 */