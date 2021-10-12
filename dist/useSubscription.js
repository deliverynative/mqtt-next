"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSubscription;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.flat.js");

require("core-js/modules/es.regexp.to-string.js");

var _react = require("react");

var _mqttPattern = require("mqtt-pattern");

var _Context = _interopRequireDefault(require("./Context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useSubscription(topic) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    client,
    connectionStatus,
    parserMethod
  } = (0, _react.useContext)(_Context.default);
  console.log(client);
  const [message, setMessage] = (0, _react.useState)(undefined);
  const subscribe = (0, _react.useCallback)(async () => {
    client.subscribe(topic, options);
  }, [client, options, topic]);
  const callback = (0, _react.useCallback)((receivedTopic, receivedMessage) => {
    if ([topic].flat().some(rTopic => (0, _mqttPattern.matches)(rTopic, receivedTopic))) {
      setMessage({
        message: (parserMethod === null || parserMethod === void 0 ? void 0 : parserMethod(receivedMessage)) || receivedMessage.toString(),
        topic: receivedTopic
      });
    }
  }, [parserMethod, topic]);
  (0, _react.useEffect)(() => {
    if (client.connected) {
      subscribe();
      client.on("message", callback);
    }
  }, [callback, client, subscribe]);
  return {
    client,
    connectionStatus,
    message,
    topic
  };
}