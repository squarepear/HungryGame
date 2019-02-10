export default class Map {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.init()
  }

  init () {
    this.tiles = []

    for (let x = 0; x < this.width; x++) {
      this.tiles.push([])
      for (let y = 0; y < this.height; y++) {
        this.tiles[x].push(0.2 + Math.random() * 0.8)
      }
    }
  }

  copy (map) {
    this.width = map.width
    this.height = map.height

    this.tiles = []

    for (let x = 0; x < this.width; x++) {
      this.tiles.push([])
      for (let y = 0; y < this.height; y++) {
        this.tiles[x].push(map.tiles[x][y])
      }
    }
  }

  setTile (x, y, value) {
    this.tiles[x][y] = value
  }

  getTile (x, y) {
    return this.tiles[x][y]
  }

  draw (sketch) {
    this.pixelSize = sketch.height / this.height

    sketch.push()
    sketch.rectMode(sketch.CORNER)
    sketch.noStroke()
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        sketch.fill(0, this.getTile(i, j) * 255, 0)
        sketch.rect(i * this.pixelSize, j * this.pixelSize, this.pixelSize, this.pixelSize)
      }
    }
    sketch.pop()
  }
}
