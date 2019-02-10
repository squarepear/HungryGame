export default class ControlPanel {
  constructor (settings, game) {
    this.settings = settings || {}
    this.game = game
    this.msg = null
  }

  message (msg, time, color) {
    this.msg = msg
    this.msgColor = color || 'black'

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => { this.msg = null }, time)
  }

  update () {
    if (this.msg) document.getElementById('infoBar').innerHTML = `<span style="color: ${this.msgColor};">${this.msg}</span>`
    else if (this.game.mainPlayer != null) document.getElementById('infoBar').innerText = (this.game.players[this.game.mainPlayer].hasTurn) ? 'Your turn!' : 'Please wait for your turn!'

    document.getElementById('player1-name').innerText = this.game.players[0].settings.name || 'Player 1'
    document.getElementById('player1-food').innerText = this.game.players[0].food
    document.getElementById('player1-health').innerText = this.game.players[0].health
    document.getElementById('player2-name').innerText = this.game.players[1].settings.name || 'Player 2'
    document.getElementById('player2-food').innerText = this.game.players[1].food
    document.getElementById('player2-health').innerText = this.game.players[1].health
  }
}
