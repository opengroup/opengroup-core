/* global module */
module.exports = function (config) {
    'use strict';
    config.set({
        autoWatch: true,
        singleRun: true,
        basePath: 'src',
        frameworks: ['jspm', 'jasmine'],

        jspm: {
            config: 'config.js',
            packages: "lib/",
            loadFiles: [
                'js/**/*.spec.js'
            ],
            serveFiles: [
                'js/**/!(*spec).js'
            ]
        },

        browsers: ['Chrome'],

        reporters: ['progress']
    });

};
