// Karma configuration
// Generated on Fri Feb 19 2016 15:10:40 GMT-0500 (EST)

module.exports = function(config) {
    config.set({

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // karma-babel-preprocessor settings
        // tell it to use babel-preset-es2015
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline'
            }
        },

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Chrome'
        ],

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // list of files to exclude
        exclude: [],

        // list of files / patterns to load in the browser
        files: ['src/js/polyfills/webrtc.polyfill.js'],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jspm',
            'jasmine'
        ],

        jspm: {
            // Edit this to your needs
            config: 'src/js/jspm.config.js',
            packages: 'src/lib/',
            loadFiles: [
                'src/**/*.test.js'
            ],
            serveFiles: [
                'src/**/*.js'
            ]
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // web server port
        port: 9876,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/{*.js,!lib{,/**}}': ['babel'],
            'src/modules/**/!(*.unit-test).js': ['babel']
        },

        // set up proxies so the test server will be able to find our files
        proxies: {
            '/src/': '/base/src/',
            '/lib/': '/base/src/lib/'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'progress'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // set up the spec reporter - I just want to see the "expected x to equal y" output in errors
        specReporter: {
            maxLogLines: 1,
            suppressErrorSummary: true,
            suppressFailed: false,
            suppressPassed: false,
            suppressSkipped: false
        }
    });
};
