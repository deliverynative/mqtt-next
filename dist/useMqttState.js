"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMqttState;

var _react = require("react");

var _Context = _interopRequireDefault(require("./Context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useMqttState() {
  const {
    connectionStatus,
    client,
    parserMethod
  } = (0, _react.useContext)(_Context.default);
  return {
    client,
    connectionStatus,
    parserMethod
  };
}