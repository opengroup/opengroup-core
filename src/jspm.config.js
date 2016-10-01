SystemJS.config({
  defaultJSExtensions: true,
  browserConfig: {
    "paths": {
      "npm:": "/lib/npm/",
      "github:": "/lib/github/",
      "OpenGroup/": "/src/"
    }
  },
  nodeConfig: {
    "paths": {
      "npm:": "lib/npm/",
      "github:": "lib/github/",
      "OpenGroup/": "src/"
    }
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.15"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "OpenGroup": {
      "main": "OpenGroup.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "clipboard": "npm:clipboard@1.5.12",
    "jquery": "npm:jquery@3.1.1",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rivets": "npm:rivets@0.9.4"
  },
  packages: {
    "npm:rivets@0.9.4": {
      "map": {
        "sightglass": "npm:sightglass@0.2.6"
      }
    },
    "npm:clipboard@1.5.12": {
      "map": {
        "good-listener": "npm:good-listener@1.1.8",
        "select": "npm:select@1.0.6",
        "tiny-emitter": "npm:tiny-emitter@1.1.0"
      }
    },
    "npm:good-listener@1.1.8": {
      "map": {
        "delegate": "npm:delegate@3.0.2"
      }
    },
    "npm:delegate@3.0.2": {
      "map": {
        "component-closest": "npm:component-closest@1.0.1"
      }
    },
    "npm:component-closest@1.0.1": {
      "map": {
        "component-matches-selector": "npm:component-matches-selector@0.1.6"
      }
    },
    "npm:component-matches-selector@0.1.6": {
      "map": {
        "component-query": "npm:component-query@0.0.3"
      }
    }
  }
});
