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

const noticeWidget = [
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'dcf-notice.js')),
	customPlumber('error wrapping noticeWidget'),
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.umd({
		dependencies: () => {
			return [
				{
					name: 'uuidGenerator',
					amd: './dcf-uuidGen.min',
					cjs: './dcf-uuidGen.min',
					global: 'dcfHelperUuidv4', // how this dependency is defined in the global scope
					param: 'uuidv4' // how this dependency is called inside the module
				}
			]
		},
		exports: () => 'Notice', // the variable name that will be returned
		namespace: () => 'dcfWidgetNotice' // how this module is named in the global scope
		// if no exports defined, capitalized filename will be used instead
	}),
	gulp.dest(buildPaths.umdCommonAppDest)
];


const uuidGen = [
		gulp.src(path.join(buildPaths.appJsCommonSrc, 'dcf-uuidGen.js')),
		customPlumber('error wrapping uuidGen'),
	$.newer({ dest:buildPaths.umdCommonAppDest }),
		$.umd({
			exports: () => 'uuidv4', // the variable name that will be returned
			namespace: () => 'dcfHelperUuidv4' // how this module is named in the global scope
		}),
		gulp.dest(buildPaths.umdCommonAppDest)
];


const dialog = [
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'dcf-dialog.js')),
	customPlumber('error wrapping dialog'),
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.umd({
		exports: () => 'Dialog', // TODO: needs to be redefined when file is modularized
		namespace: () => 'dcfDialog'
	}),
	gulp.dest(buildPaths.umdCommonAppDest)
];

const lazyLoad = [
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'dcf-lazyLoad.js')),
	customPlumber('error wrapping lazyLoad'),
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.umd({
		exports: () => 'lazyLoad', // TODO: needs to be redefined when file is modularized
		namespace: () => 'dcfLazyLoad'
	}),
	gulp.dest(buildPaths.umdCommonAppDest)
];

module.exports = {
	noticeWidget,
	uuidGen,
	dialog,
	lazyLoad
};
