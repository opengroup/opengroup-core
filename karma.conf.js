// Karma configuration
var browserstack = require("./browserstack");

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jspm',
            'mocha',
            'chai'
        ],

        browserStack: browserstack,


        // define browsers
        customLaunchers: {
          bs_firefox_windows_8: {
            base: 'BrowserStack',
            browser: 'firefox',
            browser_version: '21.0',
            os: 'Windows',
            os_version: '8'
          },
          bs_firefox_mac: {
            base: 'BrowserStack',
            browser: 'firefox',
            browser_version: '21.0',
            os: 'OS X',
            os_version: 'Mountain Lion'
          },
          bs_iphone5: {
            base: 'BrowserStack',
            device: 'iPhone 5',
            os: 'ios',
            os_version: '6.0'
          },
          iPad_3: {
            real_mobile: false,
            device: 'iPad 3rd (6.0)',
            os: 'ios',
            'os_version': '6.0',
            'browser_version': null,
            browser: 'Mobile Safari'
          }
        },

        // list of files / patterns to load in the browser
        files: ['src/js/og.core/webrtc.polyfill.js'],

        // configuration for karma-jspm
        jspm: {
            useBundles: true,
            config: 'src/config.js',
            loadFiles: ['src/test/**/*.js'],
            serveFiles: ['src/js/**/*.js'],
            packages: 'src/lib'
        },

        proxies: {
            '/base/lib/': '/base/src/lib/'
        },

        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        growlerReporter: {
            types: [
                'error',
                //'success',
                'disconnected',
                'failed'
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'growler', 'BrowserStack'],

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Firefox'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
