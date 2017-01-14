'use strict';

var gulp = require('gulp');
var reload = global.browserSync.reload;

gulp.task('serve', function () {
    global.browserSync.init({
        server: {
            baseDir: global.paths.src
        },
        ghostMode: false
    });

    gulp.watch([global.paths.html, global.paths.js]).on("change", reload);
});


