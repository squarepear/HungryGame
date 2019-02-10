import Map from 'Shared/map'
import ControlPanel from './controlPanel'
import Player from './player'
import SocketManager from './socketManager'
import ControlManager from './controlManager'

export default class Game {
  constructor (sketch, socket) {
    this.sketch = sketch
    this.socket = socket
    this.mainPlayer = null

    this.init()
    this.initSocket()
  }

  init () {
    this.map = new Map(16, 9)

    this.controlPanel = new ControlPanel({}, this)

    this.controlManager = new ControlManager(this)
    this.controlManager.initControls(this.sketch)

    this.socketManager = new SocketManager(this)

    this.players = [
      new Player({ name: 'Player 1' }, this),
      new Player({ name: 'Player 2' }, this)
    ]
  }

  initSocket () {
    this.socketManager.initSocket()
  }

  update () {
    this.players.forEach((player) => {
      player.update()
    })
    this.controlPanel.update()
    this.controlManager.update()
  }

  draw () {
    this.map.draw(this.sketch)

    this.players.forEach((player) => {
      player.draw(this.sketch)
    })
  }
}
