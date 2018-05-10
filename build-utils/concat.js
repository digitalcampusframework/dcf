const path = require('path');
const gulp = require('gulp');
const customPlumber = require('./custom-plumber');

// load all plugins in "devDependencies" into the variable $
const $ = require('gulp-load-plugins')({
	pattern: [ '*' ],
	scope: [ 'devDependencies' ]
});
let concatObj = {};



/**
 * @param {string} src: input glob string
 * @param {string} dest: output path
 * @param {string} fileName: concat file name
 * @param {string} taskName: name of the task
 */
function concatFn(src, dest, fileName, taskName) {
	$.fancyLog(`----> //** Concatenating ${taskName} JS Files <========`);
	return gulp.src(src)
			.pipe($.sourcemaps.init())
			.pipe(customPlumber(`Error Running ${taskName} task`))
			.pipe($.concat(
					{path: fileName},
					{newLine: '\n\n'}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(dest));
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
	return gulp.src(src)
			.pipe($.sourcemaps.init())
			.pipe(customPlumber(`Error Running ${taskName} task`))
			.pipe($.debug({title: `All Files - [${taskName}]`})) // uncomment to see src files
			.pipe($.newer({dest: newerDest}))
			.pipe($.debug({title: `Passed Through - [${taskName}]`})) //uncomment to see what files passed through
			.pipe($.concat(
					{path: fileName},
					{newLine: '\n\n'}))
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(dest));
}

concatObj = {
	base: concatFn,
	newer: concatNewerFn
};

module.exports = concatObj;