'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const fs = require('fs');
const glob = require("glob")

gulp.task('clean', function () {
    return gulp.src('dist')
    .pipe(clean({force: true}));
});

gulp.task('create-load', function (done) {

    let loadFileContents = `// Created by gulp create-load
import 'css';
import 'text';
import 'plugin-babel';
`;

    glob('src/{theme,plugins}/**/*.{html,js}', {}, function (er, files) {
        files.forEach((file) => {
            loadFileContents += "import '" + file.replace('src/', 'OpenGroup/').replace('.html', '.html!text') + "';\n";
        });

        fs.writeFile('src/load.js', loadFileContents, function(err) {
            if (err) {
                return console.log(err);
            }

            done();
        });
    });

});

gulp.task('build', ['clean', 'create-load', 'css'], function (done) {

    exec('jspm bundle app.js + load.js dist/build.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        done();
    });

    gulp.src('./src/index.html')
    .pipe(replace('<script>System.import("./app.js").catch(console.error.bind(console));</script>', '<script src="build.js"></script><script>System.import("./app.js").catch(console.error.bind(console));</script>'))
    .pipe(gulp.dest('./dist'));

    gulp.src(['src/lib/system.js']).pipe(gulp.dest('./dist/lib/'));
    gulp.src(['src/jspm.config.js']).pipe(gulp.dest('./dist/'));

    gulp.src([
        'src/theme/{css,images}/**/*'
    ])
    .pipe(gulp.dest('./dist/theme/'));
});
