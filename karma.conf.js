/* global module */
module.exports = function (config) {
    'use strict';

    config.set(
        {
            autoWatch: true,

            frameworks: ['jspm', 'mocha'],

            files: [
                'node_modules/babel-polyfill/dist/polyfill.js'
            ],

            jspm:
            {
                config: 'src/config.js',

                loadFiles: [
                    'src/*.spec.js'
                ],

                serveFiles: [
                    'src/!(*spec).js'
                ]
            },

            client: {
                mocha: {
                    reporter: 'html', // change Karma's debug.html to the mocha web reporter
                    ui: 'tdd'
                }
            },

            proxies: {
                '/src/': '/base/src/',
                '/jspm_packages/': '/src/jspm_packages/'
            },

            browsers: ['PhantomJS'],

            preprocessors: {
                'src/!(*spec).js': ['babel', 'sourcemap', 'coverage']
            },

            babelPreprocessor:
            {
                options: {
                    sourceMap: 'inline'
                },

                sourceFileName: function(file) {
                    return file.originalPath;
                }
            },

            coverageReporter:
            {
                instrumenters: {
                    isparta: require('isparta')
                },

                instrumenter: {
                    'src/*.js': 'isparta'
                },

                reporters:
                    [
                        {
                            type: 'text-summary'
                        },
                        {
                            type: 'html',
                            dir: 'coverage/'
                        }
                    ]
            },

            reporters: ['progress', 'coverage']
        });
};
