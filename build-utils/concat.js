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
	$.fancyLog(`----> //** Concatenating ${taskName} Files <========`);
	return $.pump([
		gulp.src(src),
		$.sourcemaps.init({loadMaps:true}),
		customPlumber(`Error Running ${taskName} task`),
		$.concat(
				{path: fileName},
				{newLine: '\n\n'}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
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
		$.newer({dest: newerDest}),
		$.concat(
				{path: fileName},
				{newLine: '\n\n'}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}

let concatObj = {
	base: concatFn,
	newer: concatNewerFn
};

module.exports = concatObj;