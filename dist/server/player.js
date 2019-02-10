'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(socket) {
  _classCallCheck(this, Player);

  this.socket = socket;
  this.id = socket.id;
  this.name = '';
  this.pos = {
    x: Math.floor(Math.random() * 16),
    y: Math.floor(Math.random() * 9)
  };
  this.health = 20;
  this.food = 20;
};

exports.default = Player;