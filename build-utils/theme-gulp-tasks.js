import path from 'path';
import gulp from 'gulp';
const $ = require('./gulp-load-plugins');
import commonPaths from './common-paths';
import buildPaths from'./build-paths';
import distPaths from'./dist-paths';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import customPlumber from './custom-plumber';


/* ------------------------ */
/* THEME BROWSERIFY TASKS
/* ------------------------ */
// with the themeBundles array we can have more than one bundle output
const themeBundles = [
	{
		entries: [`${path.join(commonPaths.themePath, 'js', 'src')}/main-body.js`],
		// if you need modules that are preBabel use umd-related paths from buildPaths
		paths: [distPaths.vendorJsDest, `${path.join(distPaths.appDestPreBabel,'common')}`, `${path.join(distPaths.appDestPreBabel, 'optional')}`],
		output: 'bundle.js', //output file name
		extensions: ['.js', '.json'],
		debug: true,
		destination: path.join(commonPaths.themePath,'js','bundled')
	}
];


// browserify and watchify multiple bundle themes: https://gist.github.com/ramasilveyra/b4309edf809e55121385
const createBundle = ({entries, paths, output, extensions, debug, destination}, isWatchify) => {

	const opts = Object.assign(watchify.args, {entries, paths, extensions, debug});
	let b = browserify(opts);

	// browserify transformations
	b.transform(babelify.configure({
		compact: false
	}));
	b.transform(['browserify-css', {
		autoInject: true,
		minify: true,
	}]);

	// browserify({ 'entries': ['./client/components/TVScheduleTab/render.js'], 'transform': [[babelify], ['envify', {'global': true, NODE_ENV: 'production'}]] }

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
/* THEME STYLE LINT TASKS
/* ----------------- */
/**
 * TODO breakout src to lint screen, print, mustard
 * instead of just linting everything each time the theme stylelint task is ran
 */
function stylelint() {
	$.fancyLog('----> //** Linting Theme SCSS files');
	return $.pump([
		gulp.src(buildPaths.themeScssGlob),
		customPlumber('Error Running stylelint:theme:cached'),
		$.cached('stylelint:Theme'),
		$.stylelint({
			fix: true, //some errors can't be fixed automatically, also seems to be an issue if word follows a semicolon,
			// file will be overwritten with report not sure why at this moment, use stylelintFix task to do that
			failAfterError: true,
			reportOutputDir: path.join(commonPaths.logPath, 'stylelint'),
			reporters: [
				{formatter: 'string', console: true},
				{formatter: 'verbose', save: 'report.txt'},
			],
			debug: true
		}),
		gulp.dest(buildPaths.themeScssLintedDest) // outputs autofixed files to build
	]);
}



/* ----------------- */
/* EXPORT MODULES
/* ----------------- */
export { themeBundles };

export default {
	stylelint,
	createBundle,
}
