/* ------------------------ */
/* EXAMPLE BROWSERIFY TASKS
/* ------------------------ */
const path = require('path');
const gulp = require('gulp');
const $ = require('./gulp-load-plugins');
const commonPaths = require('./common-paths');
const browserify = require('browserify');

export const browserifyCfg = [
				gulp.src(`${path.join(commonPaths.examplePath, 'js', 'src')}**/*.js`, {read: false}),
				$.tap((file) => {
					$.fancyLog(`----> //**bundling ${file.path}`);
					file.contents = browserify(file.path, {debug: true}).bundle();
				}),
				$.buffer(),
				$.rename((path) => {
					path.dirname = ''; //remove src level from dirname
					path.basename += '-bundled';
				}),
				$.sourcemaps.init({loadmaps: true}),
				$.sourcemaps.write('./'),
				gulp.dest(path.join(commonPaths.examplePath, 'js', 'bundled'))
			];
