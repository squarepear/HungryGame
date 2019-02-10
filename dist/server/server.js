'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _gameManager = require('./gameManager');

var _gameManager2 = _interopRequireDefault(_gameManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.Server(app);
var io = new _socket2.default(server);
var port = process.env.PORT || 8080;
var roomManager = new _gameManager2.default(io);

app.use((0, _compression2.default)({}));
app.use(_express2.default['static'](_path2.default.join(__dirname, '/../client')));

roomManager.init();

server.listen(port, function () {
  console.log('[INFO] Listening on *:' + port);
});