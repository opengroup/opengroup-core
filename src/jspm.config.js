SystemJS.config({
  meta: {
    'js/*.js': {
      'babelOptions': {
        'plugins': [
          'babel-plugin-transform-decorators-legacy'
        ]
      }
    }
  },
  browserConfig: {
    'paths': {
      'npm:': '/lib/npm/',
      'github:': '/lib/github/',
      'OpenGroup/': '/src/'
    }
  },
  nodeConfig: {
    'paths': {
      'npm:': 'lib/npm/',
      'github:': 'lib/github/',
      'OpenGroup/': 'src/'
    }
  },
  devConfig: {
    'map': {
      'babel-plugin-transform-decorators-legacy': 'npm:babel-plugin-transform-decorators-legacy@1.3.4',
      'stream': 'github:jspm/nodelibs-stream@0.2.0-alpha',
      'util': 'github:jspm/nodelibs-util@0.2.0-alpha',
      'path': 'github:jspm/nodelibs-path@0.2.0-alpha',
      'buffer': 'github:jspm/nodelibs-buffer@0.2.0-alpha',
      'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha',
      'crypto': 'github:jspm/nodelibs-crypto@0.2.0-alpha',
      'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
      'assert': 'github:jspm/nodelibs-assert@0.2.0-alpha',
      'constants': 'github:jspm/nodelibs-constants@0.2.0-alpha',
      'string_decoder': 'github:jspm/nodelibs-string_decoder@0.2.0-alpha',
      'vm': 'github:jspm/nodelibs-vm@0.2.0-alpha',
      'events': 'github:jspm/nodelibs-events@0.2.0-alpha',
      'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
      'babel-runtime': 'npm:babel-runtime@5.8.38',
      'babel': 'npm:babel-core@5.8.38',
      'core-js': 'npm:core-js@1.2.7'
    },
    'packages': {
      'npm:babel-plugin-transform-decorators-legacy@1.3.4': {
        'map': {
          'babel-template': 'npm:babel-template@6.16.0',
          'babel-plugin-syntax-decorators': 'npm:babel-plugin-syntax-decorators@6.13.0',
          'babel-runtime': 'npm:babel-runtime@6.11.6'
        }
      },
      'npm:babel-template@6.16.0': {
        'map': {
          'babel-traverse': 'npm:babel-traverse@6.16.0',
          'babel-types': 'npm:babel-types@6.16.0',
          'babylon': 'npm:babylon@6.11.4',
          'lodash': 'npm:lodash@4.16.2',
          'babel-runtime': 'npm:babel-runtime@6.11.6'
        }
      },
      'npm:babel-traverse@6.16.0': {
        'map': {
          'babel-types': 'npm:babel-types@6.16.0',
          'babylon': 'npm:babylon@6.11.4',
          'lodash': 'npm:lodash@4.16.2',
          'babel-messages': 'npm:babel-messages@6.8.0',
          'debug': 'npm:debug@2.2.0',
          'globals': 'npm:globals@8.18.0',
          'invariant': 'npm:invariant@2.2.1',
          'babel-code-frame': 'npm:babel-code-frame@6.16.0',
          'babel-runtime': 'npm:babel-runtime@6.11.6'
        }
      },
      'npm:babel-types@6.16.0': {
        'map': {
          'lodash': 'npm:lodash@4.16.2',
          'to-fast-properties': 'npm:to-fast-properties@1.0.2',
          'esutils': 'npm:esutils@2.0.2',
          'babel-runtime': 'npm:babel-runtime@6.11.6'
        }
      },
      'npm:babel-code-frame@6.16.0': {
        'map': {
          'esutils': 'npm:esutils@2.0.2',
          'js-tokens': 'npm:js-tokens@2.0.0',
          'chalk': 'npm:chalk@1.1.3'
        }
      },
      'npm:invariant@2.2.1': {
        'map': {
          'loose-envify': 'npm:loose-envify@1.2.0'
        }
      },
      'npm:debug@2.2.0': {
        'map': {
          'ms': 'npm:ms@0.7.1'
        }
      },
      'npm:loose-envify@1.2.0': {
        'map': {
          'js-tokens': 'npm:js-tokens@1.0.3'
        }
      },
      'npm:chalk@1.1.3': {
        'map': {
          'supports-color': 'npm:supports-color@2.0.0',
          'has-ansi': 'npm:has-ansi@2.0.0',
          'strip-ansi': 'npm:strip-ansi@3.0.1',
          'escape-string-regexp': 'npm:escape-string-regexp@1.0.5',
          'ansi-styles': 'npm:ansi-styles@2.2.1'
        }
      },
      'npm:strip-ansi@3.0.1': {
        'map': {
          'ansi-regex': 'npm:ansi-regex@2.0.0'
        }
      },
      'npm:has-ansi@2.0.0': {
        'map': {
          'ansi-regex': 'npm:ansi-regex@2.0.0'
        }
      },
      'npm:babel-messages@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.11.6'
        }
      },
      'npm:babel-runtime@6.11.6': {
        'map': {
          'regenerator-runtime': 'npm:regenerator-runtime@0.9.5',
          'core-js': 'npm:core-js@2.4.1'
        }
      },
      'github:jspm/nodelibs-stream@0.2.0-alpha': {
        'map': {
          'stream-browserify': 'npm:stream-browserify@2.0.1'
        }
      },
      'npm:stream-browserify@2.0.1': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'readable-stream': 'npm:readable-stream@2.1.5'
        }
      },
      'npm:readable-stream@2.1.5': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'buffer-shims': 'npm:buffer-shims@1.0.0',
          'isarray': 'npm:isarray@1.0.0',
          'string_decoder': 'npm:string_decoder@0.10.31',
          'util-deprecate': 'npm:util-deprecate@1.0.2',
          'process-nextick-args': 'npm:process-nextick-args@1.0.7',
          'core-util-is': 'npm:core-util-is@1.0.2'
        }
      },
      'github:jspm/nodelibs-buffer@0.2.0-alpha': {
        'map': {
          'buffer-browserify': 'npm:buffer@4.9.1'
        }
      },
      'npm:buffer@4.9.1': {
        'map': {
          'isarray': 'npm:isarray@1.0.0',
          'base64-js': 'npm:base64-js@1.2.0',
          'ieee754': 'npm:ieee754@1.1.6'
        }
      },
      'github:jspm/nodelibs-os@0.2.0-alpha': {
        'map': {
          'os-browserify': 'npm:os-browserify@0.2.1'
        }
      },
      'github:jspm/nodelibs-crypto@0.2.0-alpha': {
        'map': {
          'crypto-browserify': 'npm:crypto-browserify@3.11.0'
        }
      },
      'npm:crypto-browserify@3.11.0': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'browserify-sign': 'npm:browserify-sign@4.0.0',
          'create-hash': 'npm:create-hash@1.1.2',
          'browserify-cipher': 'npm:browserify-cipher@1.0.0',
          'create-hmac': 'npm:create-hmac@1.1.4',
          'public-encrypt': 'npm:public-encrypt@4.0.0',
          'create-ecdh': 'npm:create-ecdh@4.0.0',
          'randombytes': 'npm:randombytes@2.0.3',
          'diffie-hellman': 'npm:diffie-hellman@5.0.2',
          'pbkdf2': 'npm:pbkdf2@3.0.8'
        }
      },
      'npm:browserify-sign@4.0.0': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'create-hash': 'npm:create-hash@1.1.2',
          'create-hmac': 'npm:create-hmac@1.1.4',
          'browserify-rsa': 'npm:browserify-rsa@4.0.1',
          'parse-asn1': 'npm:parse-asn1@5.0.0',
          'bn.js': 'npm:bn.js@4.11.6',
          'elliptic': 'npm:elliptic@6.3.2'
        }
      },
      'npm:create-hash@1.1.2': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'ripemd160': 'npm:ripemd160@1.0.1',
          'sha.js': 'npm:sha.js@2.4.5',
          'cipher-base': 'npm:cipher-base@1.0.3'
        }
      },
      'npm:create-hmac@1.1.4': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'create-hash': 'npm:create-hash@1.1.2'
        }
      },
      'npm:public-encrypt@4.0.0': {
        'map': {
          'create-hash': 'npm:create-hash@1.1.2',
          'randombytes': 'npm:randombytes@2.0.3',
          'browserify-rsa': 'npm:browserify-rsa@4.0.1',
          'parse-asn1': 'npm:parse-asn1@5.0.0',
          'bn.js': 'npm:bn.js@4.11.6'
        }
      },
      'npm:diffie-hellman@5.0.2': {
        'map': {
          'randombytes': 'npm:randombytes@2.0.3',
          'miller-rabin': 'npm:miller-rabin@4.0.0',
          'bn.js': 'npm:bn.js@4.11.6'
        }
      },
      'npm:browserify-cipher@1.0.0': {
        'map': {
          'evp_bytestokey': 'npm:evp_bytestokey@1.0.0',
          'browserify-des': 'npm:browserify-des@1.0.0',
          'browserify-aes': 'npm:browserify-aes@1.0.6'
        }
      },
      'npm:pbkdf2@3.0.8': {
        'map': {
          'create-hmac': 'npm:create-hmac@1.1.4'
        }
      },
      'npm:create-ecdh@4.0.0': {
        'map': {
          'bn.js': 'npm:bn.js@4.11.6',
          'elliptic': 'npm:elliptic@6.3.2'
        }
      },
      'npm:browserify-des@1.0.0': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'cipher-base': 'npm:cipher-base@1.0.3',
          'des.js': 'npm:des.js@1.0.0'
        }
      },
      'npm:browserify-aes@1.0.6': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'create-hash': 'npm:create-hash@1.1.2',
          'evp_bytestokey': 'npm:evp_bytestokey@1.0.0',
          'cipher-base': 'npm:cipher-base@1.0.3',
          'buffer-xor': 'npm:buffer-xor@1.0.3'
        }
      },
      'npm:evp_bytestokey@1.0.0': {
        'map': {
          'create-hash': 'npm:create-hash@1.1.2'
        }
      },
      'npm:browserify-rsa@4.0.1': {
        'map': {
          'bn.js': 'npm:bn.js@4.11.6',
          'randombytes': 'npm:randombytes@2.0.3'
        }
      },
      'npm:parse-asn1@5.0.0': {
        'map': {
          'browserify-aes': 'npm:browserify-aes@1.0.6',
          'create-hash': 'npm:create-hash@1.1.2',
          'evp_bytestokey': 'npm:evp_bytestokey@1.0.0',
          'pbkdf2': 'npm:pbkdf2@3.0.8',
          'asn1.js': 'npm:asn1.js@4.8.1'
        }
      },
      'npm:miller-rabin@4.0.0': {
        'map': {
          'bn.js': 'npm:bn.js@4.11.6',
          'brorand': 'npm:brorand@1.0.6'
        }
      },
      'npm:sha.js@2.4.5': {
        'map': {
          'inherits': 'npm:inherits@2.0.3'
        }
      },
      'npm:cipher-base@1.0.3': {
        'map': {
          'inherits': 'npm:inherits@2.0.3'
        }
      },
      'npm:des.js@1.0.0': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
        }
      },
      'npm:elliptic@6.3.2': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'bn.js': 'npm:bn.js@4.11.6',
          'brorand': 'npm:brorand@1.0.6',
          'hash.js': 'npm:hash.js@1.0.3'
        }
      },
      'npm:asn1.js@4.8.1': {
        'map': {
          'inherits': 'npm:inherits@2.0.3',
          'bn.js': 'npm:bn.js@4.11.6',
          'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
        }
      },
      'npm:hash.js@1.0.3': {
        'map': {
          'inherits': 'npm:inherits@2.0.3'
        }
      },
      'github:jspm/nodelibs-string_decoder@0.2.0-alpha': {
        'map': {
          'string_decoder-browserify': 'npm:string_decoder@0.10.31'
        }
      }
    }
  },
  transpiler: 'plugin-babel',
  packages: {
    'OpenGroup': {
      'main': 'OpenGroup.js',
      'meta': {
        '*.js': {
          'loader': 'plugin-babel'
        }
      }
    },
    'npm:rivets@0.9.4': {
      'map': {
        'sightglass': 'npm:sightglass@0.2.6'
      }
    },
    'github:angular/bower-angular-sanitize@1.5.8': {
      'map': {
        'angular': 'github:angular/bower-angular@1.5.8'
      }
    },
    'github:angular-ui/angular-ui-router-bower@0.3.1': {
      'map': {
        'angular': 'github:angular/bower-angular@1.5.8'
      }
    },
    'npm:clipboard@1.5.12': {
      'map': {
        'good-listener': 'npm:good-listener@1.1.8',
        'select': 'npm:select@1.0.6',
        'tiny-emitter': 'npm:tiny-emitter@1.1.0'
      }
    },
    'npm:good-listener@1.1.8': {
      'map': {
        'delegate': 'npm:delegate@3.0.2'
      }
    },
    'npm:delegate@3.0.2': {
      'map': {
        'component-closest': 'npm:component-closest@1.0.1'
      }
    },
    'npm:component-closest@1.0.1': {
      'map': {
        'component-matches-selector': 'npm:component-matches-selector@0.1.6'
      }
    },
    'npm:component-matches-selector@0.1.6': {
      'map': {
        'component-query': 'npm:component-query@0.0.3'
      }
    }
  },
  map: {
    'plugin-babel': 'npm:systemjs-plugin-babel@0.0.15',
    'rivets': 'npm:rivets@0.9.4',
    'text': 'github:systemjs/plugin-text@0.0.9',
    'monospaced/angular-elastic': 'github:monospaced/angular-elastic@2.5.1',
    'danielbeeke/rhythmmeister': 'github:danielbeeke/rhythmmeister@0.2.0',
    'angular-sanitize': 'github:angular/bower-angular-sanitize@1.5.8',
    'angular-ui-router': 'github:angular-ui/angular-ui-router-bower@0.3.1',
    'angular': 'github:angular/bower-angular@1.5.8',
    'clipboard': 'npm:clipboard@1.5.12',
    'jquery': 'npm:jquery@3.1.1'
  }
});

SystemJS.config({
  packageConfigPaths: [
    'npm:@*/*.json',
    'npm:*.json',
    'github:*/*.json'
  ],
  map: {},
  packages: {}
});
