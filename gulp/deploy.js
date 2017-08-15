'use strict';

const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');

gulp.task('deploy', ['build'], function() {
    return gulp.src(['./dist/**/*', './dist/.nojekyll'])
    .pipe(ghPages({
        remoteUrl: 'git@github.com:opengroup/opengroup.github.io.git',
        branch: 'master',
        force: true
    }));
});