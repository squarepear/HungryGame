'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoomManager = function () {
  function RoomManager(io) {
    _classCallCheck(this, RoomManager);

    this.io = io;
    this.rooms = {};
  }

  _createClass(RoomManager, [{
    key: 'init',
    value: function init() {
      this.io.on('connection', function (socket) {
        var _this = this;

        var room = null;
        var name = null;
        console.log('a user connected');
        socket.on('joinRoom', function (roomName) {
          room = roomName;
          if (!_this.rooms[room] || _this.rooms[room].players.length === 0) {
            _this.rooms[room] = {
              players: [socket]
            };
            socket.emit('joinedRoom', room);
            socket.emit('setYourPlayer', 0);
          } else if (_this.rooms[room].players.length === 1) {
            _this.rooms[room].players.push(socket);
            socket.emit('joinedRoom', room);
            socket.emit('setYourPlayer', 1);
          } else {
            socket.emit('fullRoom', room);
          }
        });

        socket.on('setName', function (newName) {
          name = newName;
        });

        socket.on('disconnect', function () {
          console.log('user disconnected');
          if (this.rooms[room].players.length === 1) {
            this.rooms[room] = null;
            room = null;
          } else if (this.rooms[room].players.length === 2) {}
        });
      });
    }
  }]);

  return RoomManager;
}();

exports.default = RoomManager;