import gulp from 'gulp';
import $ from './gulp-load-plugins';

export function copy (src, dest, taskName = 'missing task name') {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		gulp.dest(dest)
	]);
};

export function copyNewer (src, dest, taskName = 'missing task name', newerDest) {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		$.debug({title: 'All Files - [copySass:newer]'}), // uncomment to see src files
		$.newer(newerDest),
		$.debug({title: 'Passed Through - [copySass:newer]'}), // uncomment to see files passed through
		gulp.dest(dest)
	]);
};

export function copyNewerRename (src, dest, taskName = 'missing task name', newerDest, ifConditions, renameConfig) {
	$.fancyLog(`----> //** Copying files [${taskName}]`);
	return $.pump([
		gulp.src(src),
		$.debug({title: 'All Files - [copySass:newer]'}), // uncomment to see src files
		$.newer(newerDest),
		$.debug({title: 'Passed Through - [copySass:newer]'}), // uncomment to see files passed through
		$.if(ifConditions, $.rename(renameConfig)),
		gulp.dest(dest)
	]);
};