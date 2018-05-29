module.exports = function(config) {
    config.set({
      frameworks: ['mocha', 'chai'],
      files: [{ pattern: 'src/**/*.js', type: 'module' }],
      reporters: ['progress'],
      customContextFile: 'test/context.html',
      customDebugFile: 'test/debug.html',
      port: 9876,  // karma web server port
      colors: true,
      logLevel: config.LOG_INFO,
      browsers: ['ChromeHeadless'],
      concurrency: Infinity
    })
  }
  