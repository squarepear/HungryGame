'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _map = require('../shared/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameManager = function () {
  function GameManager(io) {
    _classCallCheck(this, GameManager);

    this.io = io;
    this.rooms = {};
  }

  _createClass(GameManager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.io.on('connection', function (socket) {
        var room = null;
        var player = null;
        console.log('a user connected');
        socket.on('joinRoom', function (roomName) {
          if (!_this.rooms[roomName] || _this.rooms[roomName].players.length === 0) {
            player = new _player2.default(socket);
            _this.rooms[roomName] = {
              players: [player],
              map: new _map2.default(16, 9),
              name: roomName
            };
            room = _this.rooms[roomName];
            socket.emit('joinedRoom', roomName);
            socket.emit('setYourPlayer', 0);
            socket.emit('setMap', room.map);
            player.number = 0;
          } else if (_this.rooms[roomName].players.length === 1) {
            player = new _player2.default(socket);
            room = _this.rooms[roomName];
            room.players.push(player);
            socket.emit('joinedRoom', roomName);
            socket.emit('setYourPlayer', 1);
            socket.emit('setMap', room.map);
            player.number = 1;

            player.socket.emit('playerChangeName', {
              playerNum: 1 - player.number,
              newName: room.players[1 - player.number].name
            });

            room.players.forEach(function (playerI) {
              playerI.socket.emit('movePlayer', {
                playerNum: 0,
                pos: room.players[0].pos
              });
              playerI.socket.emit('movePlayer', {
                playerNum: 1,
                pos: room.players[1].pos
              });
            });

            room.players[0].socket.emit('setTurn');
          } else {
            socket.emit('fullRoom', roomName);
          }
        });

        socket.on('setName', function (newName) {
          player.name = newName;
          room.players.forEach(function (playerI) {
            playerI.socket.emit('playerChangeName', {
              playerNum: player.number,
              newName: newName
            });
          });
        });

        socket.on('move', function (pos) {
          room.players[1 - player.number].socket.emit('movePlayer', {
            playerNum: player.number,
            pos: pos
          });
        });

        socket.on('attack', function (mult) {
          room.players[1 - player.number].health -= Math.floor(player.food * mult / 2);

          room.players.forEach(function (playerI) {
            playerI.socket.emit('damagePlayer', {
              playerNum: 1 - player.number,
              value: Math.floor(player.food * mult / 2)
            });
          });
        });

        socket.on('eat', function (pos) {
          var tileValue = Math.floor(room.map.getTile(pos.x, pos.y) * 20 * 0.5);

          player.food += tileValue;

          room.players.forEach(function (playerI) {
            playerI.socket.emit('changeFood', {
              playerNum: player.number,
              amount: tileValue
            });
            playerI.socket.emit('setMapTile', {
              pos: pos,
              value: room.map.getTile(pos.x, pos.y) * 0.5
            });
          });

          room.map.setTile(pos.x, pos.y, room.map.getTile(pos.x, pos.y) * 0.5);
        });

        socket.on('heal', function () {
          var healthChange = Math.floor(player.food * 0.5);
          var foodChange = -Math.ceil(player.food * 0.5);

          room.players.forEach(function (playerI) {
            playerI.socket.emit('healPlayer', {
              playerNum: player.number,
              value: healthChange
            });
            playerI.socket.emit('changeFood', {
              playerNum: player.number,
              amount: foodChange
            });
          });

          player.health += healthChange;
          player.food += foodChange;
        });

        socket.on('changeFood', function (amount) {
          player.food += amount;

          room.players[1 - player.number].socket.emit('changeFood', {
            playerNum: player.number,
            amount: amount
          });
        });

        socket.on('endTurn', function () {
          endTurn(room, player);
        });

        socket.on('disconnect', function () {
          console.log('user disconnected');
          if (room === null) return;

          room.players.forEach(function (playerI) {
            playerI.socket.emit('endGame');
          });

          _this.rooms[room.name] = null;
          room = null;
        });
      });

      function endTurn(room, player) {
        var win = false;

        room.players.forEach(function (playerI) {
          if (playerI.health <= 0) {
            playerI.socket.emit('lose');
            room.players[1 - playerI.number].socket.emit('win');

            win = true;
          }
        });

        if (win) return;

        var _loop = function _loop(i) {
          var pos = {
            x: Math.floor(Math.random() * 16),
            y: Math.floor(Math.random() * 9)
          };

          var value = Math.min(room.map.getTile(pos.x, pos.y) * 1.05, 1);

          room.players.forEach(function (playerI) {
            playerI.socket.emit('setMapTile', {
              pos: pos,
              value: value
            });
          });

          room.map.setTile(pos.x, pos.y, value);
        };

        for (var i = 0; i < room.map.width * room.map.height / 5; i++) {
          _loop(i);
        }

        room.players[1 - player.number].socket.emit('setTurn', 1 - player.number);
      }
    }
  }]);

  return GameManager;
}();

exports.default = GameManager;