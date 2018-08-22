import path from 'path';
import gulp from 'gulp';
const $ = require('./gulp-load-plugins');
import commonPaths from './common-paths';
import buildPaths from'./build-paths';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import customPlumber from './custom-plumber';


/* ------------------------ */
/* EXAMPLE BROWSERIFY TASKS
/* ------------------------ */
// browserify and watchify multiple bundle examples: https://gist.github.com/ramasilveyra/b4309edf809e55121385
const createBundle = ({entries, paths, output, extensions, debug, destination}, isWatchify) => {

	const opts = Object.assign(watchify.args, {entries, paths, extensions, debug});
	let b = browserify(opts);

	// browserify transformations
	b.transform(babelify.configure({
		compact: false
	}));

	$.fancyLog(`----> //** ${isWatchify ? 'Watchify' : 'Browserify'}`);
	const rebundle = () => $.pump([
		b.bundle().on('error', $.gulplog.error.bind($.gulplog, 'Browserify Error')),
		source(output),
		buffer(),
		$.sourcemaps.init({ loadMaps: true }),
		// $.uglify(),
		$.sourcemaps.write('./'),
		gulp.dest(destination),
	]);


	if (isWatchify) {
		b = watchify(b);
		b.on('update', rebundle);
		b.on('log', $.gulplog.info);
	}

	return rebundle();
};


/* ----------------- */
/* EXAMPLE STYLE LINT TASKS
/* ----------------- */
function stylelint() {
	$.fancyLog('----> //** Linting Example SCSS files');
	return $.pump([
		gulp.src(buildPaths.exampleScssGlob),
		customPlumber('Error Running stylelint:example:cached'),
		// $.debug({title: 'All Files - [stylelint:newer:Example]'}), // uncomment to see src files
		$.cached('stylelint:Example'),
		// $.debug({title: 'Passed Through - [stylelint:newer:Example]'}), // uncomment to see files passed through
		$.stylelint({
			fix: false, //some errors can't be fixed automatically, also seems to be an issue if word follows a semicolon,
			// file will be overwritten with report not sure why at this moment, use stylelintFix task to do that
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
	createBundle
	// bundle,
	// browserifyTask
}