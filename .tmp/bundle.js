System.registerDynamic("config.js", [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    System.config({
      baseURL: "",
      defaultJSExtensions: true,
      transpiler: "babel",
      babelOptions: {
        // "optional": [
        //   "runtime"
        // ]
      },
      paths: {
        "github:*": "lib/github/*",
        "npm:*": "lib/npm/*"
      },

      map: {
        "babel": "npm:babel-core@5.8.38",
        "babel-runtime": "npm:babel-runtime@5.8.38",
        "clipboard": "npm:clipboard@1.5.12",
        "core-js": "npm:core-js@1.2.7",
        "jquery": "npm:jquery@3.1.1",
        "rivets": "npm:rivets@0.9.4",
        "github:jspm/nodelibs-assert@0.1.0": {
          "assert": "npm:assert@1.4.1"
        },
        "github:jspm/nodelibs-buffer@0.1.0": {
          "buffer": "npm:buffer@3.6.0"
        },
        "github:jspm/nodelibs-path@0.1.0": {
          "path-browserify": "npm:path-browserify@0.0.0"
        },
        "github:jspm/nodelibs-process@0.1.2": {
          "process": "npm:process@0.11.9"
        },
        "github:jspm/nodelibs-util@0.1.0": {
          "util": "npm:util@0.10.3"
        },
        "github:jspm/nodelibs-vm@0.1.0": {
          "vm-browserify": "npm:vm-browserify@0.0.4"
        },
        "npm:assert@1.4.1": {
          "assert": "github:jspm/nodelibs-assert@0.1.0",
          "buffer": "github:jspm/nodelibs-buffer@0.1.0",
          "process": "github:jspm/nodelibs-process@0.1.2",
          "util": "npm:util@0.10.3"
        },
        "npm:babel-runtime@5.8.38": {
          "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:buffer@3.6.0": {
          "base64-js": "npm:base64-js@0.0.8",
          "child_process": "github:jspm/nodelibs-child_process@0.1.0",
          "fs": "github:jspm/nodelibs-fs@0.1.2",
          "ieee754": "npm:ieee754@1.1.6",
          "isarray": "npm:isarray@1.0.0",
          "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:clipboard@1.5.12": {
          "good-listener": "npm:good-listener@1.1.8",
          "select": "npm:select@1.0.6",
          "tiny-emitter": "npm:tiny-emitter@1.1.0"
        },
        "npm:component-closest@1.0.1": {
          "component-matches-selector": "npm:component-matches-selector@0.1.6"
        },
        "npm:component-matches-selector@0.1.6": {
          "component-query": "npm:component-query@0.0.3"
        },
        "npm:core-js@1.2.7": {
          "fs": "github:jspm/nodelibs-fs@0.1.2",
          "path": "github:jspm/nodelibs-path@0.1.0",
          "process": "github:jspm/nodelibs-process@0.1.2",
          "systemjs-json": "github:systemjs/plugin-json@0.1.2"
        },
        "npm:debug@2.2.0": {
          "ms": "npm:ms@0.7.1"
        },
        "npm:delegate@3.0.2": {
          "component-closest": "npm:component-closest@1.0.1"
        },
        "npm:good-listener@1.1.8": {
          "delegate": "npm:delegate@3.0.2"
        },
        "npm:inherits@2.0.1": {
          "util": "github:jspm/nodelibs-util@0.1.0"
        },
        "npm:path-browserify@0.0.0": {
          "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:process@0.11.9": {
          "assert": "github:jspm/nodelibs-assert@0.1.0",
          "fs": "github:jspm/nodelibs-fs@0.1.2",
          "vm": "github:jspm/nodelibs-vm@0.1.0"
        },
        "npm:rivets@0.9.4": {
          "process": "github:jspm/nodelibs-process@0.1.2",
          "sightglass": "npm:sightglass@0.2.6",
          "systemjs-json": "github:systemjs/plugin-json@0.1.2"
        },
        "npm:util@0.10.3": {
          "inherits": "npm:inherits@2.0.1",
          "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:vm-browserify@0.0.4": {
          "indexof": "npm:indexof@0.0.1"
        }
      }
    });
  })(this);

  return _retrieveGlobal();
});
//# sourceMappingURL=bundle.js.map