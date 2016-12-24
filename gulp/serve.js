'use strict';

var gulp = require('gulp');

gulp.task('serve', function () {
    global.browserSync.init({
        server: {
            baseDir: global.paths.src
        },
        ghostMode: false
    });
});