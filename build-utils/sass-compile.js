const path = require('path');
const gulp = require('gulp');
const customPlumber = require('./custom-plumber');
const $ = require('./gulp-load-plugins');

// postCSS plugins
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const postcssCSSO = require('postcss-csso');
const postcssPresetEnv = require('postcss-preset-env');

function sassCompileScreen (src, dest, taskName) {
	$.fancyLog('----> //** Compiling all.css');
	return $.pump([
		gulp.src(src),
		customPlumber(`Error Running ${taskName}`),
		// $.debug({title: `All Files - [${taskName}]`}), // uncomment to see src files
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
					postcssNormalize({forceImport:true}),
					// postcssCSSO()
				]
		),
		$.debug({title: `Passed Through - [${taskName}]`}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}


function sassCompileBase (src, dest, taskName) {
	$.fancyLog('----> //** Compiling all.css');
	return $.pump([
		gulp.src(src),
		customPlumber(`Error Running ${taskName}`),
		// $.debug({title: `All Files - [${taskName}]`}), // uncomment to see src files
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
		$.debug({title: `Passed Through - [${taskName}]`}),
		$.sourcemaps.write('./'),
		gulp.dest(dest)
	]);
}

let sassCompileObj = {
	base: sassCompileBase,
	screen: sassCompileScreen
};

module.exports = sassCompileObj;
