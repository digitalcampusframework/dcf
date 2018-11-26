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

import exampleTasks, { exampleBundles } from './build-utils/example-theme-gulp-tasks';
import { copy, copyNewer, copyNewerRename } from "./build-utils/copy";

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
		$.newer({dest: distPaths.scssDest}),
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
gulp.task('stylelint:example:cached', () => {
	return exampleTasks.stylelint();
});



/* ----------------- */
/* CORE SASS TASKS
/* ----------------- */
gulp.task('copySass', () => {
 return copy(distPaths.scssGlob, distPaths.scssDest, 'copySass');
});


gulp.task('copySass:newer', () => {
	return copyNewer(distPaths.scssGlob, distPaths.scssDest, 'copySass:newer', distPaths.scssDest);
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
/** Example theme styles sass compilation */
gulp.task('sassCompile:example:screen', () => {
	// need to return the stream
	return sassCompile.screen(buildPaths.exampleScreenScssEntry, buildPaths.exampleCompiledCssDir, 'sassCompile:example:screen');
});


// TODO: needs to be tested when there are actual files to work with
gulp.task('sassCompile:example:mustard', () => {
	return sassCompile.base(buildPaths.exampleMustardScssEntry,buildPaths.exampleCompiledCssDir, 'sassCompile:example:mustard');
});


gulp.task('sassCompile:example:print', () => {
	return sassCompile.base(buildPaths.examplePrintScssEntry, buildPaths.exampleCompiledCssDir, 'sassCompile:example:print');
});


/** Concat screen styles */
gulp.task('cssConcat:example:screen', () => {
  return concat.base(buildPaths.exampleScreenConcatGlob, buildPaths.exampleCompiledCssDir, buildNames.exampleScreenCSS,'cssConcat:example:screen');
});


/** Minify example theme styles */
gulp.task('cssDist:example:screen', () => {
	return cssMinifyNewer(distPaths.exampleScreenCssSrc, distPaths.exampleCssMinDest,'cssDist:example:print',path.join(distPaths.exampleCssMinDest, distNames.exampleScreenMinCSS));
});


gulp.task('cssDist:example:print', () => {
	return cssMinifyNewer(distPaths.examplePrintCssSrc, distPaths.exampleCssMinDest,'cssDist:example:print',path.join(distPaths.exampleCssMinDest, distNames.examplePrintMinCSS));
});


/** Compose example screen styles */
gulp.task('exampleCssDist:screen', gulp.series(
		'sassCompile:example:screen',
		'cssConcat:example:screen',
		'cssDist:example:screen'
));


/** Compose example print styles */
gulp.task('exampleCssDist:print', gulp.series(
		'sassCompile:example:print',
		'cssDist:example:print'
));

/** Example theme screen styles watch tasks */
// watch for any changes in the example/scss folder and recompile all.min.css
gulp.task('sassDist:example:screen-watch', () => {
	// stylelint:example:cached will only lint changed files so it is fine to lint the entire scss folder on watch
	gulp.watch(distPaths.exampleScreenScssWatchGlob, gulp.series('stylelint:example:cached', 'exampleCssDist:screen'))
			.on('unlink', (ePath, stats) => {
				// if something is deleted in the example/scss folder it will also be removed from the example/build/scss folder
				cascadeDelete(ePath, stats, buildPaths.exampleScssLintedDest, 'sassDist:example:screen-watch', true);
			});
});


// watch for any changes in the assets/dist/scss folder and recompile all.min.css
gulp.task('sassDist:example:screen-watch:core', () => {
	gulp.watch(distPaths.exampleScreenCoreScssWatchGlob, gulp.series('stylelint:example:cached', 'exampleCssDist:screen'))
});


/** Example theme print styles watch tasks */
// watch for any changes in the example/scss/print folder and recompile print.min.css
gulp.task('sassDist:example:print-watch', () => {
	// stylelint:example:cached will only lint changed files so it is fine to lint the entire scss folder on watch
	gulp.watch(distPaths.examplePrintScssWatchGlob, gulp.series('exampleCssDist:print'))
			.on('unlink', (ePath, stats) => {
				// if something is deleted in the example/scss folder it will also be removed from the example/build/scss folder
				cascadeDelete(ePath, stats, buildPaths.exampleScssLintedDest, 'sassDist:example:screen-watch', true);
			});
});


// watch for any changes in the assets/dist/scss folder and recompile print.min.css
gulp.task('sassDist:example:print-watch:core', () => {
	gulp.watch(distPaths.exampleScreenCoreScssWatchGlob, gulp.series('exampleCssDist:print'))
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
// copy vendor libraries from packages and src/mustard into dist
gulp.task('copyVendor:newer', () => {
	return copyNewer(distPaths.vendorJsGlob, distPaths.vendorJsDest, 'copyVendor:newer', distPaths.vendorJsDest);
});


gulp.task('vendorDist', gulp.series('copyVendor:newer'));


gulp.task('vendorDist-watch', () => {
	gulp.watch(distPaths.vendorJsGlob, gulp.series('vendorDist'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted`);
				cascadeDelete(ePath, stats, distPaths.vendorJsDest, 'vendorDist-watch', true); // if src files
				// get deleted, delete the files inside of dist as well
			});
});



/* ----------------- */
/* MUSTARD JS TASKS
/* ----------------- */
// this task is not used atm because we are providing individual polyfill files
gulp.task('mustardConcat:newer', () => {
	// need to return the stream
	return concat.newer(buildPaths.mustardJsGlob, buildPaths.mustardJsDest, buildNames.mustardJs, 'mustardConcat:newer',  path.join(buildPaths.mustardJsDest, buildNames.mustardJs));
});


// copy polyfills from packages and src/mustard into build
gulp.task('copyMustard:newer', () => {
	return copyNewer(buildPaths.mustardJsGlob, buildPaths.mustardJsDest, 'copyMustard:newer', buildPaths.mustardJsDest);
});


// copy unminified mustard files from build to dist folder to allow manipulation
gulp.task('copyMustardDist:newer', () => {
	return copyNewer(distPaths.mustardJsSrc, distPaths.mustardJsDest, 'copyMustard:newer', distPaths.mustardJsDest);
});


// custom tasks to rename details-polyfill file, might become an issue if more than single index.js file exists
gulp.task('renameDetailsIndex', (done) => {
	$.pump([
		gulp.src(path.join(buildPaths.mustardJsDest, 'index.js'), {allowEmpty:true}),
		$.rename('details-polyfill.js'),
		gulp.dest(buildPaths.mustardJsDest),
	], done);
});

// gulp-rename does not remove existing files
gulp.task('deleteDetailsIndex', ()=>{
	return	$.delete(path.join(buildPaths.mustardJsDest, 'index.js'));
});

gulp.task('renameDetailsPolyfill', gulp.series('renameDetailsIndex', 'deleteDetailsIndex'));


// minify polyfill files into dist folder
gulp.task('mustardUglify', () => {
	return uglifyNewer(distPaths.mustardJsSrc, distPaths.mustardJsDest, 'mustardUglify', distPaths.mustardJsDest, true);
});


gulp.task('mustardDist', gulp.series('copyMustard:newer', 'renameDetailsPolyfill', 'mustardUglify', 'copyMustardDist:newer'));


gulp.task('mustardDist-watch', () => {
	gulp.watch(buildPaths.mustardJsGlob, gulp.series('mustardDist'))
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
		gulp.src(buildPaths.appJsSrcGlob),
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
			// allow caching if result.warningCount > 0
			if (result.errorCount > 0) {
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
		gulp.src(buildPaths.appJsSrcGlob),
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
	gulp.watch(buildPaths.appJsSrcGlob, gulp.series('cachedEslint'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [cachedEsLint-watch]`);
				delete $.cached.caches.eslint[ePath]; // remove deleted files from cache
			});
});



/* ----------------- */
/* BABEL TASKS
/* ----------------- */
gulp.task('babel', (done) => {
	$.fancyLog('----> //** Transpiling ES6 via Babel... 🍕');
	$.pump([
		gulp.src(buildPaths.babelAppGlob),
		customPlumber('Error Running Babel'),
		$.cached('babel'),
		$.babel({presets: [ 'env' ]}),
		gulp.dest(buildPaths.appJsDestPostBabel)
	], done);
});



/* ----------------- */
/* APP TASKS
/* ----------------- */
gulp.task('commonAppUMD', (done) => {
	delete require.cache[require.resolve('./build-utils/umd-tasks-common')];
	const umdTasksCommon = require('./build-utils/umd-tasks-common');
	$.fancyLog('----> //** Wrapping common modules in UMD');
	const promises = [];

	for (let umdTask in umdTasksCommon) {
		promises.push(
				new Promise((resolve, reject) => {
					$.pump(umdTasksCommon[umdTask], function(err) {
						if (!err) {
							resolve();
						} else {
							console.err(err);
							reject(err);
						}
					},done);
				})
		);
	}

	Promise.all(promises)
			.catch((err) => console.error(err))
			.then(() => done());
});


gulp.task('optionalAppUMD', (done) => {
	delete require.cache[require.resolve('./build-utils/umd-tasks-optional')];
	const umdTasksOptional = require('./build-utils/umd-tasks-optional');
	$.fancyLog('----> //** Wrapping optional modules in UMD');

	const promises = [];

	for (let umdTask in umdTasksOptional) {
		promises.push(
				new Promise((resolve, reject) => {
					$.pump(umdTasksOptional[umdTask], function(err) {
						if (!err) {
							resolve();
						} else {
							reject(err);
						}
					},done);
				})
		);
	}

	Promise.all(promises)
			.catch(err => console.error(err))
			.then(() => done());
});


gulp.task('appBuild', gulp.series('cachedEslint', 'commonAppUMD', 'optionalAppUMD', 'babel'));


gulp.task('appBuild-watch', (done) => {
	gulp.watch(buildPaths.appJsSrcGlob, gulp.series('appBuild'))
			// TODO test this
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [appBuild-watch]`);
				// remove deleted files from cache,
				// eslint and babel must be ran before to generate the cache otherwise it will throw an error
				delete $.cached.caches.eslint[ePath];
				delete $.cached.caches.babel[ePath];

				// TODO when removing a module, please also delete the associated config from buildutils otherwise gulp will
				// freak out
				cascadeDelete(ePath, stats, buildPaths.appJsDestPreBabel, 'appBuild-watch', true);
				cascadeDelete(ePath, stats, buildPaths.appJsDestPostBabel, 'appBuild-watch', true);
			});
});


gulp.task('appUglify:newer', () => {
	return uglifyNewer(distPaths.appSrcGlob, distPaths.appDest, 'appUglify', distPaths.appDest);
});


gulp.task('appUglify-watch', () => {
	gulp.watch(distPaths.appSrcGlob, gulp.series('appUglify:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				console.log(`${ePath} deleted - [appUglify-watch]`);
				cascadeDelete(ePath, stats, distPaths.appDest, 'appUglify-watch', true);
			});
});

gulp.task('copyPreBabel:newer', () => {
	return copyNewer(buildPaths.babelAppGlob, distPaths.appDestPreBabel, 'copyPreBabel:newer', distPaths.appDest);
});


gulp.task('copyPreBabel-watch', () => {
	gulp.watch(buildPaths.babelAppGlob, gulp.series('copyPreBabel:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				cascadeDelete(ePath, stats, distPaths.appDest, 'copyPreBabel-watch', true);
			});
});

gulp.task('copyPostBabel:newer', () => {
	return copyNewer(buildPaths.appJsDestPostBabelGlob, distPaths.appDestPostBabel, 'copyPostBabel:newer', distPaths.appDest);
});


gulp.task('copyPostBabel-watch', () => {
	gulp.watch(buildPaths.appJsDestPostBabelGlob, gulp.series('copyPostBabel:newer'))
			.on('unlink', (ePath, stats) => {
				// code to execute on delete
				cascadeDelete(ePath, stats, distPaths.appDest, 'copyPostBabel-watch', true);
			});
});

gulp.task('appDist-watch', gulp.parallel('appBuild-watch', 'appUglify-watch', 'copyPreBabel-watch', 'copyPostBabel-watch'));



// /* ------------------------ */
// /* EXAMPLE BROWSERIFY TASKS
// /* ------------------------ */
gulp.task('browserify', (done) => {
	exampleBundles.forEach(bundle => {
		exampleTasks.createBundle(bundle, false);
	});
	done(); // signal async completion
});


gulp.task('watchify', (done) => {
	// watchify runs browserify (not the gulp task) once before entering watch state
	exampleBundles.forEach(bundle => {
		exampleTasks.createBundle(bundle, true);
	});
	done(); // signal async completion
});



/* ----------------- */
/* MISC GULP TASKS
/* ----------------- */
gulp.task('outputPlugins', (done) => {
	console.log($);
	done(); // signal async completion
});


gulp.task('cleanBuildDist', (done) => {
	$.delete([commonPaths.outputBuild, commonPaths.outputDist, commonPaths.exampleBuild, distPaths.exampleCssMinDest], {force: true}, function(err, deleted) {
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
						'appBuild',
						'appUglify:newer',
						'copyPreBabel:newer',
						'copyPostBabel:newer'
			 		),
					gulp.series('sassDist'),
					gulp.series('copyCSS:newer')
			),
			gulp.series(
					'stylelint:example:cached',
					gulp.parallel(
							'exampleCssDist:screen',
							'exampleCssDist:print',
					),
			),
		));

gulp.task('watching 👀',
		gulp.parallel(
				'watchify',
				'sassDist-watch',
				'copyCSS-watch',
				'vendorDist-watch',
				'mustardDist-watch',
				'appDist-watch',
				'sassDist:example:screen-watch',
				'sassDist:example:screen-watch:core',
				'sassDist:example:print-watch',
				'sassDist:example:print-watch:core',
		)
);

// Default task
gulp.task('default', gulp.series('preWatch', 'watching 👀'));
