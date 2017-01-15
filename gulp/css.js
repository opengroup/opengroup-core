'use strict';

var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var concat = require('gulp-concat');

gulp.task('css', function () {
    var processors = [
        nested,
        autoprefixer({browsers: ['last 1 version']})
    ];

    return gulp.src(global.paths.postcss)
    .pipe(postcss(processors))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(global.paths.css))
    .pipe(global.browserSync.stream());
});