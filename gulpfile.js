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
/* ----------------- */
/* SASS TASKS
/* ----------------- */
gulp.task('copySass', () => {
	$.fancyLog('----> //** Copying SCSS files');

	return gulp.src(distPaths.scssGlob)
			.pipe(gulp.dest(distPaths.scssDest));
});

gulp.task('copySass:newer', () => {
	$.fancyLog('----> //** Copying SCSS files');

	return gulp.src(distPaths.scssGlob)
			.pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer(distPaths.scssDest))
			.pipe($.debug({title: 'Passed Through'})) // uncomment to see if files are processed if min file is newer than src files
			.pipe(gulp.dest(distPaths.scssDest));
});

gulp.task('copySass-watch', () => {
	gulp.watch(distPaths.scssGlob, gulp.series('copySass:newer'))
		.on('unlink', (ePath, stats) => {
				// code to execute on delete
				let fileName = path.basename(ePath);
				let pathPieces = ePath.split(path.sep);
				let childAppFolder = pathPieces[pathPieces.length - 2];
				// console.log(`${path.join(distPaths.scssDest,childAppFolder, fileName)} path to be deleted`);
				$.delete(path.join(distPaths.scssDest,childAppFolder, fileName), {force: true}, function(err, deleted) {
					if (err) throw err;
					// deleted files
					console.log(deleted);
				});
			});
});

/* ----------------- */
/* STYLE LINT TASKS
/* ----------------- */



/* ----------------- */
/* VENDOR JS TASKS
/* ----------------- */
function vendorBuildFn() {
	$.fancyLog('----> //** Concatenating Vendor JS Files <========');
	return gulp.src(buildPaths.vendorJsGlob)
			.pipe($.sourcemaps.init())
			.pipe(customPlumber('Error Running vendorBuild task'))
			.pipe($.concat(
					{path: buildNames.vendorJs},
					{newLine: '\n\n'}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(buildPaths.vendorJsDest));
};

gulp.task('vendorBuild', (done) => {
	vendorBuildFn();
	done();
});

gulp.task('vendorBuild:newer', () => {
	$.fancyLog('----> //** Concatenating Vendor JS Files');
	return gulp.src(buildPaths.vendorJsGlob)
			.pipe($.sourcemaps.init())
			.pipe(customPlumber('Error Running vendorBuild task'))
			.pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({dest: path.join(buildPaths.vendorJsDest, buildNames.vendorJs)}))
			.pipe($.debug({title: 'Passed Through'})) //uncomment to see what files passed through
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
			// .pipe($.debug({title: 'Passed Through'})) // uncomment to see what files passed through
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

gulp.task('vendorDist', gulp.series('vendorBuild', 'vendorUglify'));

gulp.task('vendorDist-watch', () => {
	gulp.watch(buildPaths.vendorJsGlob, gulp.series('vendorBuild:newer', 'vendorUglify'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted`)
				vendorBuildFn(); // if files get deleted, rebuild dist file.
			});
});

/* ----------------- */
/* ESLINT TASKS
/* ----------------- */
gulp.task('cachedLint', () => {
	$.fancyLog('----> //** Linting JS files in App (cached) 🌈');

	return gulp.src(buildPaths.appJsGlob)
			.pipe($.cached('eslint')) // Only uncached and changed files past this point
			.pipe($.eslint())
			.pipe($.eslint.format())
			.pipe($.eslint.result((result) => {
				if (result.warningCount > 0 || result.errorCount > 0) {
					delete $.cached.caches.eslint[path.resolve(result.filePath)]; // If a file has errors/warnings uncache it
				}
			}));
			// .pipe($.eslint.failAfterError());
});

gulp.task('cachedLint-watch', () => {
	gulp.watch(buildPaths.appJsGlob, gulp.series('cachedLint'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted`);
				delete $.cached.caches.eslint[ePath]; // remove deleted files from cache
			});
});

/* ----------------- */
/* BABEL TASKS
/* ----------------- */
gulp.task('babel', () => {
	$.fancyLog('-> Transpiling ES6 via Babel... 🍕');

	return gulp.src(buildPaths.appJsGlob)
			.pipe(customPlumber('Error Running Babel'))
			.pipe($.debug({title: 'All Files'})) // uncomment to see src files
			.pipe($.newer({ dest: buildPaths.appJsDest }))
			.pipe($.debug({title: 'Passed Through'})) // uncomment to see src files
			.pipe($.babel({
				presets: [ 'env' ]
			}))
			.pipe(gulp.dest(buildPaths.appJsDest));
});

gulp.task('babel-watch', () => {
	gulp.watch(buildPaths.appJsGlob, gulp.series('babel'));
});

/* ----------------- */
/* MISC GULP TASKS
/* ----------------- */
gulp.task('outputPlugins', (done) => {
	console.log($);
	done(); // signal async completion
});


gulp.task('cleanBuildDist', (done) => {
	$.delete([commonPaths.outputBuild, commonPaths.outputDist], {force: true}, function(err, deleted) {
		if (err) throw err;
		// deleted files
		console.log(`${deleted} cleaned`);

	});
});




/**
 * ------------------------
 * COMPOSING GULP TASKS
 * ------------------------
 */



gulp.task('preWatch', gulp.series('cleanBuildDist','cachedLint', 'vendorDist', 'copySass'));
// TODO make cachedLint-watch and babel-watch a series task
gulp.task('watching 👀', gulp.parallel('cachedLint-watch', 'copySass-watch', 'vendorDist-watch'));

// Default task
gulp.task('default', gulp.series('preWatch', 'watching 👀'));


// TODO delete cache of cached JS files processed with eslint and stylint
