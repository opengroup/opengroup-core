'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');

gulp.task('css', function () {
    return gulp.src(global.paths.scss)
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(global.paths.css))
    .pipe(global.browserSync.stream());
});