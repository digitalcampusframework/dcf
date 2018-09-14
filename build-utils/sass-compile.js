const path = require('path');
const gulp = require('gulp');
const customPlumber = require('./custom-plumber');
const $ = require('./gulp-load-plugins');

// postCSS plugins
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const postcssPresetEnv = require('postcss-preset-env');

/**
 * @param {string} src: input concat path string
 * @param {string} dest: output path
 * @param {string} taskName: name of the task
 * @param {string} newerDest: target file for newer to compared against
 */
function sassCompileScreenNewer (src, dest, taskName, newerDest) {
	$.fancyLog('----> //** Compiling all.css');
	return $.pump([
		gulp.src(src),
		customPlumber(`Error Running ${taskName}`),
		$.newer({dest: newerDest}),
		$.sassGlob(),
		$.sourcemaps.init({loadMaps:true}),
		$.sass({
			includePaths: [path.dirname(require.resolve('modularscale-sass'))]
		})
				.on('error', $.sass.logError),
		$.postcss(
				[
					autoprefixer,
					postcssPresetEnv(),
					postcssNormalize({forceImport:true})
				]
		),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}

function sassCompileScreen (src, dest, taskName) {
	$.fancyLog('----> //** Compiling all.css');
	return $.pump([
		gulp.src(src),
		customPlumber(`Error Running ${taskName}`),
		$.sassGlob(),
		$.sourcemaps.init({loadMaps:true}),
		$.sass({
			includePaths: [path.dirname(require.resolve('modularscale-sass'))]
		})
				.on('error', $.sass.logError),
		$.postcss(
				[
					autoprefixer,
					postcssPresetEnv(),
					postcssNormalize({forceImport:true})
				]
		),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}


function sassCompileBase (src, dest, taskName) {
	$.fancyLog('----> //** Compiling all.css');
	return $.pump([
		gulp.src(src),
		customPlumber(`Error Running ${taskName}`),
		$.sassGlob(),
		$.sourcemaps.init({loadMaps:true}),
		$.sass({
			includePaths: [path.dirname(require.resolve('modularscale-sass'))]
		})
				.on('error', $.sass.logError),
		$.postcss(
				[
					autoprefixer,
					postcssPresetEnv(),
				]
		),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}

let sassCompileObj = {
	base: sassCompileBase,
	screen: sassCompileScreen,
	screenNewer: sassCompileScreenNewer
};

module.exports = sassCompileObj;
