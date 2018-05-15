/**
 * ------------------
 * SETTING UP GULP
 * ------------------
 */
// Modules
const pkg = require('./package.json'); // bring in properties specified in package.json
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const baseStylelint = require('stylelint');
// Path and name variables
const commonPaths = require('./build-utils/common-paths');
const buildPaths = require('./build-utils/build-paths');
const buildNames = require('./build-utils/build-names');
const distPaths = require('./build-utils/dist-paths');
const distNames = require('./build-utils/dist-names');
// Custom functions
const $ = require('./build-utils/gulp-load-plugins');
const cascadeDelete = require('./build-utils/cascade-delete');
const concat = require('./build-utils/concat');
const customPlumber = require('./build-utils/custom-plumber');
const uglifyNewer = require('./build-utils/uglify');
const checkDirectory = require('./build-utils/check-directory');

// TODO update all pipe vinyl methods to use pump instead
// TODO write documentation

/**
 * ------------
 * GULP TASKS
 * ------------
 */

/* ----------------- */
/* STYLE LINT TASKS
/* ----------------- */
gulp.task('stylelint:newer', (done) => {
	$.pump([
		gulp.src(distPaths.scssGlob),
		customPlumber('Error Running stylelint:newer'),
		// $.debug({title: 'All Files - [stylelint:newer]'}), // uncomment to see src files
		$.newer({dest: distPaths.scssDest}),
		$.debug({title: 'Passed Through - [stylelint:newer]'}), // uncomment to see files passed through
		$.stylelint({
			// fix: true, //some errors can't be fixed automatically, also seems to be an issue if word follows a semicolon, file will be overwritten with report not sure why at this moment, use stylelintFix task to do that
			failAfterError: false,
			reportOutputDir: path.join(commonPaths.logPath, 'stylelint'),
			reporters: [
				{formatter: 'string', console: true},
				{formatter: 'verbose', save: 'report.txt'},
			],
			debug: true
		}),
		// gulp.dest(distPaths.scssPath)
	], done);
});


//manually run this to autofix eslint issues in src files
gulp.task('stylelintFix', (done) => {
	$.pump([
				gulp.src(distPaths.scssGlob),
				customPlumber('Error Running stylelintFix'),
				$.newer({dest: distPaths.scssDest}),
				$.debug({title: 'Passed Through - [stylelint:newer]'}),
				$.postcss(
						[
							baseStylelint({ fix:true }),
							$.postcssReporter({clearMessages: true}),
						],
						{
							syntax: $.postcssScss
						}
				),
				gulp.dest(distPaths.scssPath)]
			, done)
});


// TODO figure out how to output correctly to report file
gulp.task('stylelintFixTest', (done) => {
	$.pump([
				gulp.src(distPaths.scssGlob),
				$.newer({dest: distPaths.scssDest}),
				$.debug({title: 'Passed Through - [stylelintFixTest]'}),
				$.postcss(
						[
							baseStylelint({ fix:true }),
							// $.postcssReporter({clearMessages: true}),
						],
						{
							syntax: $.postcssScss
						}
				)
						.on('error', (error) => {
							fs.writeFileSync(path.join(commonPaths.logPath, 'testlint', 'stylelint-results.js'), error.toString(), {encoding:'ascii'});
						}),
				gulp.dest(distPaths.scssPath)]
			, done)
});



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
			// .pipe($.debug({title: 'All Files - [copySass:newer]'})) // uncomment to see src files
			.pipe($.newer(distPaths.scssDest))
			.pipe($.debug({title: 'Passed Through - [copySass:newer]'})) // uncomment to see what files are passed through
			.pipe(gulp.dest(distPaths.scssDest));
});


gulp.task('copySass-watch', () => {
	gulp.watch(distPaths.scssGlob, gulp.series('copySass:newer'))
		.on('unlink', (ePath, stats) => {
				// code to execute on delete
				cascadeDelete(ePath, stats, distPaths.scssDest, 'copySass-watch', true);
			});
});


gulp.task('sassDist', gulp.series('stylelint:newer', 'copySass:newer'));


gulp.task('sassDist-watch', () => {
	gulp.watch(distPaths.scssGlob, gulp.series('stylelint:newer', 'copySass:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				cascadeDelete(ePath, stats, distPaths.scssDest, 'sassDist-watch', true);
			});
});



/* ----------------- */
/* CSS TASKS
/* ----------------- */
gulp.task('copyCSS', (done) => {
	$.pump([
			gulp.src(distPaths.cssGlob),
			customPlumber('Error Running copyCSS'),
			gulp.dest(distPaths.cssDest)
	], done);
});


gulp.task('copyCSS:newer', (done) => {
	$.pump([
		gulp.src(distPaths.cssGlob),
		customPlumber('Error Running copyCSS'),
		$.newer(distPaths.cssDest),
		$.debug({title: 'Passed Through - [copySass:newer]'}), // uncomment to see what files are passed through
		gulp.dest(distPaths.cssDest)
	], done);
});

gulp.task('copyCSS-watch', () => {
		gulp.watch(distPaths.cssGlob, gulp.series('copyCSS:newer'))
				.on('unlink', (ePath, stats) => {
					cascadeDelete(ePath, stats, distPaths.cssDest, 'copyCSS-watch', true);
				});
});

/* ----------------- */
/* VENDOR JS TASKS
/* ----------------- */
gulp.task('vendorConcat:newer', () => {
	// need to return the stream
  return concat.newer(buildPaths.vendorJsGlob, buildPaths.vendorJsDest, buildNames.vendorJs, 'vendorConcat:newer',  path.join(buildPaths.vendorJsDest, buildNames.vendorJs));
});


gulp.task('vendorUglify', () => {
	return uglifyNewer(distPaths.vendorJsSrc, distPaths.vendorJsDest, 'vendorUglify', path.join(distPaths.vendorJsDest, distNames.vendorMinJs));
});


gulp.task('vendorDist', gulp.series('vendorConcat:newer', 'vendorUglify'));


gulp.task('vendorDist-watch', () => {
	gulp.watch(buildPaths.vendorJsGlob, gulp.series('vendorConcat:newer', 'vendorUglify'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted, recompiling ${distNames.vendorMinJs} - [vendorDist-watch]`);
				concat.base(buildPaths.vendorJsGlob, buildPaths.vendorJsDest, buildNames.vendorJs, 'vendorConcat'); // if src files get deleted, force rebuild of dist file
			});
});



/* ----------------- */
/* MUSTARD JS TASKS
/* ----------------- */
gulp.task('mustardConcat:newer', () => {
	// need to return the stream
	return concat.newer(buildPaths.mustardJsGlob, buildPaths.mustardJsDest, buildNames.mustardJs, 'mustardConcat:newer',  path.join(buildPaths.mustardJsDest, buildNames.mustardJs));
});


gulp.task('mustardUglify', () => {
	return uglifyNewer(distPaths.mustardJsSrc, distPaths.mustardJsDest, 'mustardUglify', path.join(distPaths.mustardJsDest, distNames.vendorMinJs));
});


gulp.task('mustardDist', gulp.series('mustardConcat:newer', 'mustardUglify'));


gulp.task('mustardDist-watch', () => {
	gulp.watch(buildPaths.mustardJsGlob, gulp.series('mustardConcat:newer', 'mustardUglify'))
			.on('unlink', (ePath, stats) => {
// code to execute on delete
				console.log(`${ePath} deleted, recompiling ${buildNames.mustardMinJs} - [mustardDist-watch]`);
				concat.base(buildPaths.mustardJsGlob, buildPaths.mustardJsDest, buildNames.mustardJs, 'mustardConcat'); // if src files get deleted, force rebuild of dist file
			});
});



/* ----------------- */
/* ESLINT TASKS
/* ----------------- */
gulp.task('cachedEslint', () => {
	$.fancyLog('----> //** Linting JS files in App (cached) 🌈');

	return gulp.src(buildPaths.appJsGlob)
			.pipe(customPlumber('Error Running eslint'))
			.pipe($.cached('eslint')) // Only uncached and changed files past this point
			.pipe($.eslint({
				fix: false
			}))
			.pipe($.eslint.format())
			.pipe($.eslint.format('html', (results) => {
				checkDirectory(path.join(commonPaths.logPath, 'eslint'), (err) => {
					if(err) {
						console.log("esLint Error:", err);
					} else {
						//Carry on, all good, directory exists / created.
						fs.writeFile(path.join(commonPaths.logPath, 'eslint', 'eslint-results.html'), results, (err) => {
							if (err) { return console.log(err) }
							console.log('esLint log created');
						});
					}
				});
			}))
			.pipe($.eslint.result((result) => {
				if (result.warningCount > 0 || result.errorCount > 0) {
					delete $.cached.caches.eslint[path.resolve(result.filePath)]; // If a file has errors/warnings uncache it
				}
			}))
			.pipe($.eslint.failAfterError());
});


//manually run this to autofix eslint issues in src files
gulp.task('eslintFix', () => {
	$.fancyLog('----> //** Linting JS files in App (cached) 🌈');

	return gulp.src(buildPaths.appJsGlob)
			.pipe(customPlumber('Error Running eslint'))
			.pipe($.cached('eslint')) // Only uncached and changed files past this point
			.pipe($.eslint({
				fix:true
			}))
			.pipe($.eslint.format())
			.pipe($.eslint.format('html', (results) => {
				checkDirectory(path.join(commonPaths.logPath, 'eslint'), (err) => {
					if(err) {
						console.log("esLint Error:", err);
					} else {
						//Carry on, all good, directory exists / created.
						fs.writeFile(path.join(commonPaths.logPath, 'eslint', 'eslint-results.html'), results, (err) => {
							if (err) { return console.log(err) }
							console.log('esLint log created');
						});
					}
				});
			}))
			.pipe($.eslintIfFixed(buildPaths.appJsPath))
			.pipe($.eslint.result((result) => {
				if (result.warningCount > 0 || result.errorCount > 0) {
					delete $.cached.caches.eslint[path.resolve(result.filePath)]; // If a file has errors/warnings uncache it
				}
			}))
			.pipe($.eslint.failAfterError());
});


gulp.task('cachedEslint-watch', () => {
	gulp.watch(buildPaths.appJsGlob, gulp.series('cachedEslint'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [cachedEsLint-watch]`);
				delete $.cached.caches.eslint[ePath]; // remove deleted files from cache
			});
});



/* ----------------- */
/* BABEL TASKS
/* ----------------- */
gulp.task('babel:newer', () => {
	$.fancyLog('-> Transpiling ES6 via Babel... 🍕');

	return gulp.src(buildPaths.appJsGlob)
			.pipe(customPlumber('Error Running Babel'))
			.pipe($.debug({title: 'All Babel Files'})) // uncomment to see src files
			.pipe($.newer({ dest: buildPaths.appJsDest }))
			.pipe($.debug({title: 'Passed Through Babel Files'})) // uncomment to see src files
			.pipe($.babel({
				presets: [ 'env' ]
			}))
			.pipe(gulp.dest(buildPaths.appJsDest));
});


gulp.task('lintBabel', gulp.series('cachedEslint', 'babel:newer'));


gulp.task('lintBabel-watch', () => {
	gulp.watch(buildPaths.appJsGlob, gulp.series('cachedEslint', 'babel:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [lintBabel-watch]`);
				delete $.cached.caches.eslint[ePath]; // remove deleted files from cache
				cascadeDelete(ePath, stats, buildPaths.appJsDest, 'lintBabel-watch', true);
			});
});



/* ----------------- */
/* APP TASKS
/* ----------------- */
gulp.task('copyOptionalApp:newer', () => {
	$.fancyLog('----> //** Copying Optional App files');

	return gulp.src(distPaths.optionalAppGlob)
			.pipe($.debug({title: 'All Files - [copyOptionalApp:newer]'})) // uncomment to see src files
			.pipe($.newer({ dest:distPaths.optionalAppDest }))
			.pipe($.debug({title: 'Passed Through - [copyOptionalApp:newer]'})) // uncomment to see passed through files
			.pipe(gulp.dest(distPaths.optionalAppDest))

});


gulp.task('copyOptionalApp-watch', () => {
	gulp.watch(distPaths.optionalAppGlob, gulp.series('copyOptionalApp:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [copyOptionalApp-watch]`);
				cascadeDelete(ePath, stats, distPaths.optionalAppDest, 'copyOptionalApp-watch', false);
			});
});


gulp.task('commonAppConcat:newer', () => {
	return concat.newer(buildPaths.commonAppGlob, buildPaths.commonAppDest, buildNames.appJs, 'commonAppConcat:newer', path.join(buildPaths.commonAppDest, buildNames.appJs));
});


gulp.task('commonAppUglify', () => {
	return uglifyNewer(distPaths.commonAppSrc, distPaths.commonAppDest, 'commonAppUglify', path.join(distPaths.commonAppDest, distNames.commonAppMinJs));
});


gulp.task('commonAppDist', gulp.series('commonAppConcat:newer', 'commonAppUglify'));


gulp.task('commonAppDist-watch', () => {
	gulp.watch(buildPaths.commonAppGlob, gulp.series('commonAppConcat:newer', 'commonAppUglify'))
			.on('unlink', (ePath, stats) => {
				console.log(`${ePath} deleted, recompiling ${distNames.commonAppMinJs} - [commonApp-watch]`)
				concat.base(buildPaths.commonAppGlob, buildPaths.commonAppDest, buildNames.appJs, 'commonAppConcat'); // if src files get deleted, force rebuild of dist file.
			});
});


gulp.task('appDist-watch', gulp.parallel('lintBabel-watch', 'copyOptionalApp-watch', 'commonAppDist-watch'));



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
		console.log(`${deleted} build and dist folders cleaned 🗑`);
		done();
	});
});



/**
 * -------------------------
 * COMPOSING MAIN GULP TASKS
 * -------------------------
 */
gulp.task('preWatch',
		gulp.series('cleanBuildDist',
			gulp.parallel(
					gulp.series('vendorDist'),
					gulp.series('mustardDist'),
					gulp.series('lintBabel',
							gulp.parallel('copyOptionalApp:newer', 'commonAppDist'),
					gulp.series('sassDist'),
					gulp.series('copyCSS:newer')
		))));

gulp.task('watching 👀', gulp.parallel('sassDist-watch', 'copyCSS-watch', 'vendorDist-watch', 'mustardDist-watch', 'appDist-watch'));

// Default task
gulp.task('default', gulp.series('preWatch', 'watching 👀'));

