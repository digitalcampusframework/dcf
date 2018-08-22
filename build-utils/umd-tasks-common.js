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
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'notice.js')),
	customPlumber('error wrapping noticeWidget'),
	$.debug({title: 'All Files - [UMDnoticeWidget:newer]'}), // uncomment to see src files
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.debug({title: 'Passed Through - [UMDnoticeWidget:newer]'}), // uncomment to see passed
	$.umd({
		dependencies: () => {
			return [
				{
					name: 'uuidGenerator',
					amd: './uuid-gen',
					cjs: './uuid-gen',
					global: 'dcfHelperUuidv4', // how this dependency is defined in the global scope
					param: 'uuidv4' // how this dependency is called inside the module
				}
			]
		},
		namespace: () => 'dcfWidgetNotice'
	}),
	gulp.dest(buildPaths.umdCommonAppDest)
];


const uuidGen = [
		gulp.src(path.join(buildPaths.appJsCommonSrc, 'uuid-gen.js')),
		customPlumber('error wrapping uuidGen'),
	$.debug({title: 'All Files - [UMDuuidGen:newer]'}), // uncomment to see src files
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.debug({title: 'Passed Through - [UMDuuidGen:newer]'}), // uncomment to see passed
		$.umd({
			exports: () => 'uuidv4',
			namespace: () => 'dcfHelperUuidv4'
		}),
		gulp.dest(buildPaths.umdCommonAppDest)
];


const dialog = [
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'dialog.js')),
	customPlumber('error wrapping dialog'),
	$.debug({title: 'All Files - [UMDdialog:newer]'}), // uncomment to see src files
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.debug({title: 'Passed Through - [UMDdialog:newer]'}), // uncomment to see passed
	$.umd({
		namespace: () => 'dcfDialog'
	}),
	gulp.dest(buildPaths.umdCommonAppDest)
];

const lazyLoad = [
	gulp.src(path.join(buildPaths.appJsCommonSrc, 'lazy-load.js')),
	customPlumber('error wrapping lazyLoad'),
	$.debug({title: 'All Files - [UMDlazyload:newer]'}), // uncomment to see src files
	$.newer({ dest:buildPaths.umdCommonAppDest }),
	$.debug({title: 'Passed Through - [UMDlazyload:newer]'}), // uncomment to see passed
	$.umd({
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

// export default {
// 	noticeWidget,
// 	uuidGen,
// 	dialog,
// 	lazyLoad
// }