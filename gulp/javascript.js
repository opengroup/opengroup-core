'use strict';

var gulp = require('gulp'),
exec = require('child_process').exec;

gulp.task('js', function () {
  exec('jspm bundle js/app.js -wid', function (err, stdout, stderr) {
    cb(err);
  });
});
