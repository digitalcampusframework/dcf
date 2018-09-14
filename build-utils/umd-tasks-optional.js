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
