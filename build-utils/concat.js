const path = require('path');
const gulp = require('gulp');
const customPlumber = require('./custom-plumber');
const $ = require('./gulp-load-plugins');

/**
 * @param {string} src: input glob string
 * @param {string} dest: output path
 * @param {string} fileName: concat file name
 * @param {string} taskName: name of the task
 */
function concatFn(src, dest, fileName, taskName) {
	$.fancyLog(`----> //** Concatenating ${taskName} JS Files <========`);
	return $.pump([
		gulp.src(src),
		$.sourcemaps.init({loadMaps:true}),
		customPlumber(`Error Running ${taskName} task`),
		$.debug({title: `All Files - [${taskName}]`}),
		$.concat(
				{path: fileName},
				{newLine: '\n\n'}),
		$.debug({title: `Passed Through - [${taskName}]`}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
	// return gulp.src(src)
	// 		.pipe($.sourcemaps.init())
	// 		.pipe(customPlumber(`Error Running ${taskName} task`))
	// 		.pipe($.concat(
	// 				{path: fileName},
	// 				{newLine: '\n\n'}))
	// 		.pipe($.sourcemaps.write('./'))
	// 		.pipe(gulp.dest(dest));
}


/**
 * @param {string} src: input glob string
 * @param {string} dest: output path
 * @param {string} fileName: concat file name
 * @param {string} taskName: name of the task
 * @param {string} newerDest: target file for newer to compared against
 */
function concatNewerFn(src, dest, fileName, taskName, newerDest) {
	$.fancyLog(`----> //** Concatenating ${taskName} Files`);
	return $.pump([
		gulp.src(src),
		$.sourcemaps.init({loadMaps:true}),
		customPlumber(`Error Running ${taskName} task`),
		$.debug({title: `All Files - [${taskName}]`}),
		$.newer({dest: newerDest}),
		$.debug({title: `Passed Through - [${taskName}]`}),
		$.concat(
				{path: fileName},
				{newLine: '\n\n'}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
	// return gulp.src(src)
	// 		.pipe($.sourcemaps.init())
	// 		.pipe(customPlumber(`Error Running ${taskName} task`))
	// 		.pipe($.debug({title: `All Files - [${taskName}]`})) // uncomment to see src files
	// 		.pipe($.newer({dest: newerDest}))
	// 		.pipe($.debug({title: `Passed Through - [${taskName}]`})) //uncomment to see what files passed through
	// 		.pipe($.concat(
	// 				{path: fileName},
	// 				{newLine: '\n\n'}))
	// 		.pipe($.sourcemaps.write('./'))
	// 		.pipe(gulp.dest(dest));
}

let concatObj = {
	base: concatFn,
	newer: concatNewerFn
};

module.exports = concatObj;