"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
  function Map(width, height) {
    _classCallCheck(this, Map);

    this.width = width;
    this.height = height;
    this.init();
  }

  _createClass(Map, [{
    key: "init",
    value: function init() {
      this.tiles = [];

      for (var x = 0; x < this.width; x++) {
        this.tiles.push([]);
        for (var y = 0; y < this.height; y++) {
          this.tiles[x].push(0.2 + Math.random() * 0.8);
        }
      }
    }
  }, {
    key: "copy",
    value: function copy(map) {
      this.width = map.width;
      this.height = map.height;

      this.tiles = [];

      for (var x = 0; x < this.width; x++) {
        this.tiles.push([]);
        for (var y = 0; y < this.height; y++) {
          this.tiles[x].push(map.tiles[x][y]);
        }
      }
    }
  }, {
    key: "setTile",
    value: function setTile(x, y, value) {
      this.tiles[x][y] = value;
    }
  }, {
    key: "getTile",
    value: function getTile(x, y) {
      return this.tiles[x][y];
    }
  }, {
    key: "draw",
    value: function draw(sketch) {
      this.pixelSize = sketch.height / this.height;

      sketch.push();
      sketch.rectMode(sketch.CORNER);
      sketch.noStroke();
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          sketch.fill(0, this.getTile(i, j) * 255, 0);
          sketch.rect(i * this.pixelSize, j * this.pixelSize, this.pixelSize, this.pixelSize);
        }
      }
      sketch.pop();
    }
  }]);

  return Map;
}();

exports.default = Map;