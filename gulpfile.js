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
const baseStylelint = require('stylelint'); // require stylelint separately from gulp-stylelint due to conflicting names in gulp-load-plugins
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
const sassCompile = require('./build-utils/sass-compile');
const cssMinifyNewer = require('./build-utils/css-minify');

/**
 * ------------
 * GULP TASKS
 * ------------
 */

/* ----------------- */
/* CORE STYLE LINT TASKS
/* ----------------- */
gulp.task('stylelint:newer', (done) => {
	$.fancyLog('----> //** Linting SCSS files');
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
	$.fancyLog('----> //** Linting SCSS files');
	$.pump([
				gulp.src(distPaths.scssGlob),
				customPlumber('Error Running stylelintFix'),
				$.newer({dest: distPaths.scssDest}),
				$.debug({title: 'Passed Through - [stylelintFix]'}),
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
/* EXAMPLE STYLE LINT TASKS
/* ----------------- */
gulp.task('stylelint:example:cached', (done) => {
	$.fancyLog('----> //** Linting Example SCSS files');
	$.pump([
		gulp.src(buildPaths.exampleScssGlob),
		customPlumber('Error Running stylelint:newer:Example'),
		// $.debug({title: 'All Files - [stylelint:newer:Example]'}), // uncomment to see src files
		$.cached('stylelint:Example'),
		$.debug({title: 'Passed Through - [stylelint:newer:Example]'}), // uncomment to see files passed through
		$.stylelint({
			fix: true, //some errors can't be fixed automatically, also seems to be an issue if word follows a semicolon, file will be overwritten with report not sure why at this moment, use stylelintFix task to do that
			failAfterError: true,
			reportOutputDir: path.join(commonPaths.logPath, 'stylelint'),
			reporters: [
				{formatter: 'string', console: true},
				{formatter: 'verbose', save: 'report.txt'},
			],
			debug: true
		}),
		gulp.dest(buildPaths.exampleScssLintedDest) // outputs autofixed files to build
	], done);
});



/* ----------------- */
/* CORE SASS TASKS
/* ----------------- */
gulp.task('copySass', (done) => {
	$.fancyLog('----> //** Copying SCSS files');
	$.pump([
		gulp.src(distPaths.scssGlob),
		gulp.dest(distPaths.scssDest)
	], done);
});


gulp.task('copySass:newer', (done) => {
	$.fancyLog('----> //** Copying SCSS files');
	$.pump([
		gulp.src(distPaths.scssGlob),
		// $.debug({title: 'All Files - [copySass:newer]'})), // uncomment to see src files
		$.newer(distPaths.scssDest),
		$.debug({title: 'Passed Through - [copySass:newer]'}),
		gulp.dest(distPaths.scssDest)
	], done);
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
/* EXAMPLE SASS TASKS
/* ----------------- */
gulp.task('sassCompile:example:screen', () => {
	// need to return the stream
	return sassCompile.screen(buildPaths.exampleScreenScssEntry, buildPaths.exampleCompiledCssDir, 'sassCompile:example:screen');
});


// TODO: convert to scss glob right away, ask Ryan how will grunt handle the sass glob

// TODO: needs to be tested when there are actual files to work with
gulp.task('sassCompile:example:mustard', () => {
	return sassCompile.base(buildPaths.exampleMustardScssEntry,buildPaths.exampleCompiledCssDir, 'sassCompile:example:mustard');
});


// TODO: needs to be tested when there are actual files to work with
gulp.task('sassCompile:example:print', () => {
	return sassCompile.base(buildPaths.examplePrintScssEntry,buildPaths.exampleCompiledCssDir, 'sassCompile:example:print');
});


gulp.task('cssConcat:example:screen', () => {
  return concat.base(buildPaths.exampleScreenConcatGlob, buildPaths.exampleCompiledCssDir, buildNames.exampleScreenCSS,'cssConcat:example:screen');
});


gulp.task('cssDist:example:screen', () => {
	return cssMinifyNewer(distPaths.exampleScreenCssSrc,distPaths.exampleScreenCssDest,'cssDist:example:screen',path.join(distPaths.exampleScreenCssDest, distNames.exampleScreenMinCSS));
});

gulp.task('exampleCssDist:screen', gulp.series(
		'stylelint:example:cached',
		'sassCompile:example:screen',
		'cssConcat:example:screen',
		'cssDist:example:screen'
));

gulp.task('sassDist:example:screen-watch', () => {
	// stylelint:example:cached will only lint changed files so it is fine to lint the entire scss folder on watch
	gulp.watch(distPaths.exampleScreenScssWatchGlob, gulp.series('exampleCssDist:screen'))
			.on('unlink', (ePath, stats) => {
				// if something is deleted in the example/scss folder it will also be removed from the example/build/scss folder
				cascadeDelete(ePath, stats, buildPaths.exampleScssLintedDest, 'sassDist:example:screen-watch', true);
			});
});

// watch for any changes in the assets/dist/scss folder and recompile all.min.css
gulp.task('sassDist:example:screen-watch:core', () => {
	gulp.watch(distPaths.exampleScreenCoreScssWatchGlob, gulp.series('exampleCssDist:screen'))
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
gulp.task('cachedEslint', (done) => {
	$.fancyLog('----> //** Linting JS files in App (cached) 🌈');

	$.pump([
		gulp.src(buildPaths.appJsGlob),
		customPlumber('Error Running eslint'),
		$.cached('eslint'), // Only uncached and changed files past this point
		$.eslint({fix: false}),
		$.eslint.format(),
		$.eslint.format('html', (results) => {
			checkDirectory(path.join(commonPaths.logPath, 'eslint'), (err) => {
				if(err) {
					console.log('esLint Error:', err);
				} else {
					//Carry on, all good, directory exists / created.
					fs.writeFile(path.join(commonPaths.logPath, 'eslint', 'eslint-results.html'), results, (err) => {
						if (err) { return console.log(err) }
						$.fancyLog('🚨️ esLint log created  🚨️');
					});
				}
			});
		}),
		$.eslint.result((result) => {
			if (result.warningCount > 0 || result.errorCount > 0) {
				delete $.cached.caches.eslint[path.resolve(result.filePath)]; // If a file has errors/warnings uncache it
			}
		}),
		$.eslint.failAfterError()
	], done);
});


//manually run this to autofix eslint issues in src files
gulp.task('eslintFix', (done) => {
	$.fancyLog('----> //** Lint and Fix JS files in App 🌈');
	$.pump([
		gulp.src(buildPaths.appJsGlob),
		customPlumber('Error Running eslint'),
		$.eslint({fix: true}),
		$.eslint.format(),
		$.eslint.format('html', (results) => {
			checkDirectory(path.join(commonPaths.logPath, 'eslint'), (err) => {
				if(err) {
					console.log('esLint Error:', err);
				} else {
					//Carry on, all good, directory exists / created.
					fs.writeFile(path.join(commonPaths.logPath, 'eslint', 'eslint-results.html'), results, (err) => {
						if (err) { return console.log(err) }
						$.fancyLog('🚨️ esLint log created  🚨️');
					});
				}
			});
		}),
		$.eslint.failAfterError()
	], done);
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
gulp.task('babel:newer', (done) => {
	$.fancyLog('-> Transpiling ES6 via Babel... 🍕');

	$.pump([
		gulp.src(buildPaths.appJsGlob),
		customPlumber('Error Running Babel'),
		$.newer({ dest: buildPaths.appJsDest }),
		$.debug({title: 'Passed Through Babel Files'}),
		$.babel({presets: [ 'env' ]}),
		gulp.dest(buildPaths.appJsDest)
	], done);
});


gulp.task('lintBabel', gulp.series('cachedEslint', 'babel:newer'));


gulp.task('lintBabel-watch', () => {
	gulp.watch(buildPaths.appJsGlob, gulp.series('lintBabel'))
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
gulp.task('copyOptionalApp:newer', (done) => {
	$.fancyLog('----> //** Copying Optional App files');

	$.pump([
		gulp.src(distPaths.optionalAppGlob),
		$.debug({title: 'All Files - [copyOptionalApp:newer]'}), // uncomment to see src files
		$.newer({ dest:distPaths.optionalAppDest }),
		$.debug({title: 'Passed Through - [copyOptionalApp:newer]'}), // uncomment to see passed through files
		gulp.dest(distPaths.optionalAppDest)
	], done);
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
	$.delete([commonPaths.outputBuild, commonPaths.outputDist, commonPaths.exampleBuild, distPaths.exampleScreenCssDest], {force: true}, function(err, deleted) {
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
		gulp.series(
			'cleanBuildDist',
			gulp.parallel(
					gulp.series('vendorDist'),
					gulp.series('mustardDist'),
					gulp.series(
						'lintBabel',
						gulp.parallel('copyOptionalApp:newer', 'commonAppDist'),
			 		),
					gulp.series('sassDist'),
					gulp.series('copyCSS:newer')
			),
			'exampleCssDist:screen'
		));

gulp.task('watching 👀',
		gulp.parallel(
				'sassDist-watch',
				'copyCSS-watch',
				'vendorDist-watch',
				'mustardDist-watch',
				'appDist-watch',
				'sassDist:example:screen-watch',
				'sassDist:example:screen-watch:core'
		)
);

// Default task
gulp.task('default', gulp.series('preWatch', 'watching 👀'));
