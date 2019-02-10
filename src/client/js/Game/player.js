export default class Player {
  constructor (settings, game) {
    this.settings = settings || {}
    this.game = game
    this.map = game.map
    this.controlManager = game.controlManager
    this.socketManager = game.socketManager
    this.controlPanel = game.controlPanel
    this.pos = {
      x: -1,
      y: -1
    }
    this.health = 20
    this.food = 20
  }

  move (x, y) {
    if (this.game.players[1 - this.game.mainPlayer].pos.x === this.pos.x + x && this.game.players[1 - this.game.mainPlayer].pos.y === this.pos.y + y) {
      this.attackPlayer(x, y)
      return true
    }

    if (this.pos.x + x >= this.map.width || this.pos.x + x < 0 || this.pos.y + y >= this.map.height || this.pos.y + y < 0) {
      this.controlPanel.message('Cannot move outside of game border!', 2000, 'red')
      return true
    }

    if (this.food < 2) {
      this.controlPanel.message('Not enough food to move!', 2000, 'red')
      return true
    }

    this.moveTo(this.pos.x + x, this.pos.y + y)
    this.changeFood(-2)

    this.socketManager.movePlayer(this.pos.x, this.pos.y)

    this.endTurn()
  }

  moveTo (x, y) {
    this.pos.x = x
    this.pos.y = y
  }

  attackPlayer (x, y) {
    if (this.food < 5) {
      this.controlPanel.message('Not enough food to attack!', 2000, 'red')
      return
    }

    this.socketManager.attackPlayer()
    this.changeFood(-5)

    this.endTurn()
  }

  eat () {
    if (Math.floor(this.map.getTile(this.pos.x, this.pos.y) * 20 * 0.5) < 1) {
      this.controlPanel.message('Food source not large enough to eat!', 2000, 'red')
      return
    }

    this.socketManager.eat(this.pos.x, this.pos.y)

    this.endTurn()
  }

  skipTurn () {
    this.controlPanel.message('Turn skipped!', 2000, 'red')

    this.endTurn()
  }

  endTurn () {
    this.socketManager.endTurn()
    this.hasTurn = false
  }

  changeFood (amount, notEmit) {
    this.food += amount

    if (!notEmit) this.socketManager.useFood(amount)
  }

  damage (value) {
    this.health -= value
  }

  update () {
    if (this.settings.main && this.hasTurn) {
      if (this.controlManager.getKeyPressed(68) || this.controlManager.getKeyPressed(39)) this.move(1, 0)
      else if (this.controlManager.getKeyPressed(65) || this.controlManager.getKeyPressed(37)) this.move(-1, 0)
      else if (this.controlManager.getKeyPressed(83) || this.controlManager.getKeyPressed(40)) this.move(0, 1)
      else if (this.controlManager.getKeyPressed(87) || this.controlManager.getKeyPressed(38)) this.move(0, -1)
      else if (this.controlManager.getKeyPressed(32)) this.eat()
      else if (this.controlManager.getKeyPressed(16)) this.skipTurn()
    }
  }

  draw (sketch) {
    sketch.push()
    sketch.ellipseMode(sketch.CENTER)
    if (this.settings.main) sketch.fill(0, 0, 255)
    else sketch.fill(255, 0, 0)
    sketch.noStroke()
    sketch.ellipse(this.pos.x * this.map.pixelSize + this.map.pixelSize / 2, this.pos.y * this.map.pixelSize + this.map.pixelSize / 2, this.map.pixelSize * 0.8, this.map.pixelSize * 0.8)
    sketch.pop()
  }
}
