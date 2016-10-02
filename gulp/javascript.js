'use strict';

var gulp = require('gulp'),
  reload = global.browserSync.reload;

// JavaScript livereload.
gulp.task('js', function () {
  return gulp.watch('./src/build.js').on("change", reload);
});
