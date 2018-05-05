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
						output: { comments: $.uglifySaveLicense }
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


gulp.task('copySass', () => {
	$.fancyLog('----> //** Copying SCSS files');

	return gulp.src(distPaths.scssGlob)
			.pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer(distPaths.scssDest))
			.pipe($.debug({title: 'Passed Through'})) // uncomment to see if files are processed if min file is newer than src files
			.pipe(gulp.dest(distPaths.scssDest));
});

gulp.task('esLint', () => {
	//take files from JS and mustard and lint them no dest
	$.fancyLog('----> //** Linting JS files in App & Mustard 🌈');
})

gulp.task('eslint', () => {
	$.fancyLog('-> Linting Javascript via eslint...');
	return gulp.src(pkg.globs.babelJs)
	// default: use local linting config
			.pipe($.eslint({
				// Load a specific ESLint config
				configFile: '.eslintrc.json'
			}))
			// format ESLint results and print them to the console
			.pipe($.eslint.format());
});

gulp.task('cached-lint', () => {
	$.fancyLog('-> Linting Javascript via eslint...');
	gulp.src([ `${pkg.paths.src.js }**/*.js`, `!${pkg.paths.src.js}/vendor/**/*.js` ])
			.pipe($.cached('eslint'))
			// Only uncached and changed files past this point
			.pipe($.eslint())
			.pipe($.eslint.format())
			.pipe($.eslint.result((result) => {
				if (result.warningCount > 0 || result.errorCount > 0) {
					// If a file has errors/warnings remove uncache it
					delete $.cached.caches.eslint[$.path.resolve(result.filePath)];
				}
			}));
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