import gulp from 'gulp';
import $ from './gulp-load-plugins';

export function copy (src, dest, taskName = 'missing task name') {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		gulp.dest(dest)
	]);
}

export function copyNewer (src, dest, taskName = 'missing task name', newerDest) {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		$.newer(newerDest),
		gulp.dest(dest)
	]);
}

export function copyNewerRename (src, dest, taskName = 'missing task name', newerDest, ifConditions, renameConfig) {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		$.newer(newerDest),
		$.if(ifConditions, $.rename(renameConfig)),
		gulp.dest(dest)
	]);
}
