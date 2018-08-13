/*
*  Task configurations for wrapping widgets in Universal Module Definitions
 */
const path = require('path');
const gulp = require('gulp');
const $ = require('./gulp-load-plugins');
const buildPaths = require('./build-paths');
const customPlumber = require('./custom-plumber');

/**
 * Warning: if no exports option set, the exported variable (for commonJS) is taken from the file name and capitalized
 * so if you are returning something, make sure that you either specify an exports option or rename the file to
 * match. See https://github.com/eduardolundgren/gulp-umd#options
 */

const test = [
	gulp.src(path.join(buildPaths.appJsOptionalSrc, 'test.js')),
	customPlumber('error wrapping noticeWidget'),
	$.debug({title: 'All Files - [UMDnoticeWidget:newer]'}), // uncomment to see src files
	$.newer({ dest:buildPaths.commonAppDest }),
	$.debug({title: 'Passed Through - [UMDnoticeWidget:newer]'}), // uncomment to see passed
	$.umd({
		dependencies: () => {
			return [
				{
					name: 'uuidGenerator',
					amd: 'uuid-gen',
					cjs: 'uuid-gen',
					global: 'dcf-helper-uuidv4', // how this dependency is defined in the global scope
					param: 'uuidv4' // how this dependency is called inside the module
				}
			]
		},
		namespace: () => 'dcfWidgetNotice'
	}),
	gulp.dest(buildPaths.optionaAppDest)
];


module.exports = {
	test
};