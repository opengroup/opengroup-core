module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: [
            'jspm',
            'mocha',
            'chai'
        ],
        files: ['src/js/polyfills/webrtc.polyfill.js'],
        jspm: {
            config: 'src/js/jspm.config.js',
            stripExtension: false,
            loadFiles: ['src/test/**/*.js'],
            serveFiles: ['src/js/**/*.js'],
            packages: 'src/lib',
            browser: 'src/js/jspm.config.js',
        },
        proxies: {
            '/base/lib/': '/base/src/lib/',
            '/lib/': '/base/lib/'
        },
        exclude: [],
        preprocessors: {},
        growlerReporter: {
            types: [
                'error',
                //'success',
                'disconnected',
                'failed'
            ]
        },

        reporters: ['mocha', 'growler'],
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,
        autoWatch: true,
        browsers: [
            'Firefox',
            'Chrome'
        ],
        singleRun: true
    });
};
