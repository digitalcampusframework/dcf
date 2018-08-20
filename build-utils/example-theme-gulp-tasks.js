const path = require('path');
const gulp = require('gulp');
const $ = require('./gulp-load-plugins');
const commonPaths = require('./common-paths');
const buildPaths = require('./build-paths');
const browserify = require('browserify');
const customPlumber = require('./custom-plumber');


/* ------------------------ */
/* EXAMPLE BROWSERIFY TASKS
/* ------------------------ */
function browserifyTask() {
	return $.pump([
				gulp.src(`${path.join(commonPaths.examplePath, 'js', 'src')}**/*.js`, {read: false}),
				$.tap((file) => {
					$.fancyLog(`----> //**bundling ${file.path}`);
					file.contents = browserify(file.path, {
						paths: ['./assets/dist/js/app/common', './assets/dist/js/app/optional'],
						debug: true
					}).bundle();
				}),
				$.buffer(),
				$.sourcemaps.init({loadmaps: true}),
				$.rename((path) => {
					path.dirname = ''; //remove src level from dirname
					path.basename += '-bundled';
				}),
				$.sourcemaps.write('./'),
				gulp.dest(path.join(commonPaths.examplePath,'js','bundled'))
		])
}

/* ----------------- */
/* EXAMPLE STYLE LINT TASKS
/* ----------------- */
function stylelint() {
	$.fancyLog('----> //** Linting Example SCSS files');
	return $.pump([
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
	]);
}


export default {
	stylelint,
	browserifyTask
}