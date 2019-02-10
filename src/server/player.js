export default class Player {
  constructor (socket) {
    this.socket = socket
    this.id = socket.id
    this.name = ''
    this.pos = {
      x: Math.floor(Math.random() * 16),
      y: Math.floor(Math.random() * 9)
    }
    this.health = 20
    this.food = 20
  }
}
