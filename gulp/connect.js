'use strict';

var gulp = require('gulp');

// Start local dev server.
gulp.task('connect', function () {
  global.browserSync.init({
    server: {
      baseDir: global.paths.src
    },
    ghostMode: false
  });
});
