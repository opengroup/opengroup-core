SystemJS.config({
  browserConfig: {
    "paths": {
      "npm:": "/lib/npm/",
      "github:": "/lib/github/",
      "OpenGroup/": "/src/"
    },
    "bundles": {
      "build.js": [
        "js/app.js",
        "npm:clipboard@1.5.12/lib/clipboard.js",
        "npm:clipboard@1.5.12.json",
        "npm:good-listener@1.1.8/src/listen.js",
        "npm:good-listener@1.1.8.json",
        "npm:delegate@3.0.2/src/delegate.js",
        "npm:delegate@3.0.2.json",
        "npm:component-closest@1.0.1/index.js",
        "npm:component-closest@1.0.1.json",
        "npm:component-matches-selector@0.1.6/index.js",
        "npm:component-matches-selector@0.1.6.json",
        "github:jspm/nodelibs-process@0.2.0-alpha/process.js",
        "github:jspm/nodelibs-process@0.2.0-alpha.json",
        "npm:component-query@0.0.3/index.js",
        "npm:component-query@0.0.3.json",
        "npm:good-listener@1.1.8/src/is.js",
        "npm:tiny-emitter@1.1.0/index.js",
        "npm:tiny-emitter@1.1.0.json",
        "npm:clipboard@1.5.12/lib/clipboard-action.js",
        "npm:select@1.0.6/src/select.js",
        "npm:select@1.0.6.json",
        "npm:jquery@3.1.1/dist/jquery.js",
        "npm:jquery@3.1.1.json",
        "npm:rivets@0.9.4/dist/rivets.js",
        "npm:rivets@0.9.4.json",
        "npm:sightglass@0.2.6/index.js",
        "npm:sightglass@0.2.6.json",
        "js/og.core/group/Group.js",
        "js/og.core/peer/PeerService.js",
        "js/og.core/base/Events.js",
        "npm:systemjs-plugin-babel@0.0.15/babel-helpers/createClass.js",
        "npm:systemjs-plugin-babel@0.0.15.json",
        "npm:systemjs-plugin-babel@0.0.15/babel-helpers/classCallCheck.js",
        "npm:systemjs-plugin-babel@0.0.15/babel-helpers/toConsumableArray.js",
        "npm:systemjs-plugin-babel@0.0.15/babel-helpers/inherits.js",
        "npm:systemjs-plugin-babel@0.0.15/babel-helpers/possibleConstructorReturn.js",
        "js/og.core/connection/ConnectionBus.js",
        "js/og.core/config/ConfigService.js",
        "js/og.core/connection/EasyWebRct/OgEasyWebRtc.js",
        "js/og.core/connection/EasyWebRct/OgEasyWebRtcSignalerTest.js",
        "js/og.core/connection/EasyWebRct/OgEasyWebRtcSignalerManuel.js",
        "js/og.core/connection/EasyWebRct/EasyWebRtc.js"
      ]
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
