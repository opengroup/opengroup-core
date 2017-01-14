'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
var browserSync = require('browser-sync').create();

process.setMaxListeners(0);

global.paths = {
    'html': './src/**/*.html',
    'js': './src/js/**/*.js',
    'src': './src'
};

global.browserSync = browserSync;

requireDir('./gulp', { recurse: false });
gulp.task('default', ['serve']);