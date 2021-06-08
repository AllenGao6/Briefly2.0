/*! For license information please see reactPlayerFacebook.js.LICENSE.txt */
(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["reactPlayerFacebook"],{"./node_modules/react-player/lazy/players/Facebook.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";eval('\n\nfunction _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }\n\nObject.defineProperty(exports, "__esModule", ({\n  value: true\n}));\nexports.default = void 0;\n\nvar _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));\n\nvar _utils = __webpack_require__(/*! ../utils */ "./node_modules/react-player/lazy/utils.js");\n\nvar _patterns = __webpack_require__(/*! ../patterns */ "./node_modules/react-player/lazy/patterns.js");\n\nfunction _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar SDK_URL = \'https://connect.facebook.net/en_US/sdk.js\';\nvar SDK_GLOBAL = \'FB\';\nvar SDK_GLOBAL_READY = \'fbAsyncInit\';\nvar PLAYER_ID_PREFIX = \'facebook-player-\';\n\nvar Facebook = /*#__PURE__*/function (_Component) {\n  _inherits(Facebook, _Component);\n\n  var _super = _createSuper(Facebook);\n\n  function Facebook() {\n    var _this;\n\n    _classCallCheck(this, Facebook);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _super.call.apply(_super, [this].concat(args));\n\n    _defineProperty(_assertThisInitialized(_this), "callPlayer", _utils.callPlayer);\n\n    _defineProperty(_assertThisInitialized(_this), "playerID", _this.props.config.playerId || "".concat(PLAYER_ID_PREFIX).concat((0, _utils.randomString)()));\n\n    _defineProperty(_assertThisInitialized(_this), "mute", function () {\n      _this.callPlayer(\'mute\');\n    });\n\n    _defineProperty(_assertThisInitialized(_this), "unmute", function () {\n      _this.callPlayer(\'unmute\');\n    });\n\n    return _this;\n  }\n\n  _createClass(Facebook, [{\n    key: "componentDidMount",\n    value: function componentDidMount() {\n      this.props.onMount && this.props.onMount(this);\n    }\n  }, {\n    key: "load",\n    value: function load(url, isReady) {\n      var _this2 = this;\n\n      if (isReady) {\n        (0, _utils.getSDK)(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(function (FB) {\n          return FB.XFBML.parse();\n        });\n        return;\n      }\n\n      (0, _utils.getSDK)(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(function (FB) {\n        FB.init({\n          appId: _this2.props.config.appId,\n          xfbml: true,\n          version: _this2.props.config.version\n        });\n        FB.Event.subscribe(\'xfbml.render\', function (msg) {\n          // Here we know the SDK has loaded, even if onReady/onPlay\n          // is not called due to a video that cannot be embedded\n          _this2.props.onLoaded();\n        });\n        FB.Event.subscribe(\'xfbml.ready\', function (msg) {\n          if (msg.type === \'video\' && msg.id === _this2.playerID) {\n            _this2.player = msg.instance;\n\n            _this2.player.subscribe(\'startedPlaying\', _this2.props.onPlay);\n\n            _this2.player.subscribe(\'paused\', _this2.props.onPause);\n\n            _this2.player.subscribe(\'finishedPlaying\', _this2.props.onEnded);\n\n            _this2.player.subscribe(\'startedBuffering\', _this2.props.onBuffer);\n\n            _this2.player.subscribe(\'finishedBuffering\', _this2.props.onBufferEnd);\n\n            _this2.player.subscribe(\'error\', _this2.props.onError);\n\n            if (_this2.props.muted) {\n              _this2.callPlayer(\'mute\');\n            } else {\n              _this2.callPlayer(\'unmute\');\n            }\n\n            _this2.props.onReady(); // For some reason Facebook have added `visibility: hidden`\n            // to the iframe when autoplay fails, so here we set it back\n\n\n            document.getElementById(_this2.playerID).querySelector(\'iframe\').style.visibility = \'visible\';\n          }\n        });\n      });\n    }\n  }, {\n    key: "play",\n    value: function play() {\n      this.callPlayer(\'play\');\n    }\n  }, {\n    key: "pause",\n    value: function pause() {\n      this.callPlayer(\'pause\');\n    }\n  }, {\n    key: "stop",\n    value: function stop() {// Nothing to do\n    }\n  }, {\n    key: "seekTo",\n    value: function seekTo(seconds) {\n      this.callPlayer(\'seek\', seconds);\n    }\n  }, {\n    key: "setVolume",\n    value: function setVolume(fraction) {\n      this.callPlayer(\'setVolume\', fraction);\n    }\n  }, {\n    key: "getDuration",\n    value: function getDuration() {\n      return this.callPlayer(\'getDuration\');\n    }\n  }, {\n    key: "getCurrentTime",\n    value: function getCurrentTime() {\n      return this.callPlayer(\'getCurrentPosition\');\n    }\n  }, {\n    key: "getSecondsLoaded",\n    value: function getSecondsLoaded() {\n      return null;\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      var attributes = this.props.config.attributes;\n      var style = {\n        width: \'100%\',\n        height: \'100%\'\n      };\n      return /*#__PURE__*/_react["default"].createElement("div", _extends({\n        style: style,\n        id: this.playerID,\n        className: "fb-video",\n        "data-href": this.props.url,\n        "data-autoplay": this.props.playing ? \'true\' : \'false\',\n        "data-allowfullscreen": "true",\n        "data-controls": this.props.controls ? \'true\' : \'false\'\n      }, attributes));\n    }\n  }]);\n\n  return Facebook;\n}(_react.Component);\n\nexports.default = Facebook;\n\n_defineProperty(Facebook, "displayName", \'Facebook\');\n\n_defineProperty(Facebook, "canPlay", _patterns.canPlay.facebook);\n\n_defineProperty(Facebook, "loopOnEnded", true);\n\n//# sourceURL=webpack://frontend/./node_modules/react-player/lazy/players/Facebook.js?')}}]);