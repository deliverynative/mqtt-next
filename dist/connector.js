"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Connector;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _mqtt = require("mqtt");

var _react = require("react");

var _Context = _interopRequireDefault(require("./Context"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Connector(_ref) {
  let {
    brokerUrl,
    children,
    enabled,
    options = {
      keepalive: 0
    },
    parserMethod
  } = _ref;
  if (!enabled) return /*#__PURE__*/React.createElement(React.Fragment, null, children);
  const clientRef = (0, _react.useRef)(null);
  const [connectionStatus, setStatus] = (0, _react.useState)("Offline");
  const mqttConnect = (0, _react.useCallback)(async () => {
    setStatus(_types.STATUSES.CONNECTING);
    clientRef.current = (0, _mqtt.connect)(brokerUrl, options);
    clientRef.current.on("connect", () => {
      setStatus(_types.STATUSES.CONNECTED);
    });
    clientRef.current.on("reconnect", () => {
      setStatus(_types.STATUSES.RECONNECTING);
    });
    clientRef.current.on("disconnect", () => {
      setStatus(_types.STATUSES.DISCONNECTING);
    });
    clientRef.current.on("error", err => {
      console.log("Connection error: ".concat(err));
      setStatus(err.message);
    });
    clientRef.current.on("offline", () => {
      setStatus(_types.STATUSES.OFFLINE);
    });
    clientRef.current.on("end", () => {
      setStatus(_types.STATUSES.OFFLINE);
    });
  }, [brokerUrl, options]);
  (0, _react.useEffect)(() => {
    if (!clientRef.current) {
      mqttConnect();
    }
  }, [clientRef, mqttConnect, parserMethod]);
  return /*#__PURE__*/React.createElement(_Context.default.Provider, {
    value: {
      client: clientRef.current,
      connectionStatus,
      parserMethod
    }
  }, children);
}