export default class SocketManager {
  constructor (game) {
    this.game = game
    this.socket = game.socket
  }

  initSocket () {
    this.socket.on('setMap', (map) => {
      this.game.map.copy(map)
    })

    this.socket.on('setMapTile', (data) => {
      this.game.map.setTile(data.pos.x, data.pos.y, data.value)
    })

    this.socket.on('setYourPlayer', (playerNum) => {
      this.game.mainPlayer = playerNum
      this.game.players[playerNum].settings.main = true
    })

    this.socket.on('setTurn', () => {
      this.game.players[this.game.mainPlayer].hasTurn = true
    })

    this.socket.on('playerChangeName', (data) => {
      this.game.players[data.playerNum].settings.name = data.newName
    })

    this.socket.on('movePlayer', (data) => {
      this.game.players[data.playerNum].moveTo(data.pos.x, data.pos.y)
    })

    this.socket.on('damagePlayer', (data) => {
      this.game.players[data.playerNum].damage(data.value)
    })

    this.socket.on('changeFood', (data) => {
      this.game.players[data.playerNum].changeFood(data.amount, true)
    })

    this.socket.on('win', () => {
      this.game.controlPanel.message('YOU WIN!', 60 * 60 * 24 * 1000, 'green')
    })

    this.socket.on('lose', () => {
      this.game.controlPanel.message('YOU LOSE!', 60 * 60 * 24 * 1000, 'red')
    })

    this.socket.on('endGame', () => {
      window.location.reload()
    })
  }

  movePlayer (x, y) {
    this.socket.emit('move', {
      x,
      y
    })
  }

  eat (x, y) {
    this.socket.emit('eat', {
      x,
      y
    })
  }

  attackPlayer () {
    this.socket.emit('attack')
  }

  useFood (amount) {
    this.socket.emit('changeFood', amount)
  }

  endTurn () {
    this.socket.emit('endTurn')
  }
}
