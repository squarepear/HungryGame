import Player from './player'
import Map from '../shared/map'

export default class GameManager {
  constructor (io) {
    this.io = io
    this.rooms = {}
  }

  init () {
    this.io.on('connection', (socket) => {
      let room = null
      let player = null
      console.log('a user connected')
      socket.on('joinRoom', (roomName) => {
        if (!this.rooms[roomName] || this.rooms[roomName].players.length === 0) {
          player = new Player(socket)
          this.rooms[roomName] = {
            players: [
              player
            ],
            map: new Map(16, 9),
            name: roomName
          }
          room = this.rooms[roomName]
          socket.emit('joinedRoom', roomName)
          socket.emit('setYourPlayer', 0)
          socket.emit('setMap', room.map)
          player.number = 0
        } else if (this.rooms[roomName].players.length === 1) {
          player = new Player(socket)
          room = this.rooms[roomName]
          room.players.push(player)
          socket.emit('joinedRoom', roomName)
          socket.emit('setYourPlayer', 1)
          socket.emit('setMap', room.map)
          player.number = 1

          player.socket.emit('playerChangeName', {
            playerNum: 1 - player.number,
            newName: room.players[1 - player.number].name
          })

          room.players.forEach((playerI) => {
            playerI.socket.emit('movePlayer', {
              playerNum: 0,
              pos: room.players[0].pos
            })
            playerI.socket.emit('movePlayer', {
              playerNum: 1,
              pos: room.players[1].pos
            })
          })

          room.players[0].socket.emit('setTurn')
        } else {
          socket.emit('fullRoom', roomName)
        }
      })

      socket.on('setName', (newName) => {
        player.name = newName
        room.players.forEach((playerI) => {
          playerI.socket.emit('playerChangeName', {
            playerNum: player.number,
            newName
          })
        })
      })

      socket.on('move', (pos) => {
        room.players[1 - player.number].socket.emit('movePlayer', {
          playerNum: player.number,
          pos
        })
      })

      socket.on('attack', () => {
        room.players[1 - player.number].health -= Math.floor(player.food / 2)

        room.players.forEach((playerI) => {
          playerI.socket.emit('damagePlayer', {
            playerNum: 1 - player.number,
            value: Math.floor(player.food / 2)
          })
        })
      })

      socket.on('eat', (pos) => {
        let tileValue = Math.floor(room.map.getTile(pos.x, pos.y) * 20 * 0.5)

        player.food += tileValue

        room.players.forEach((playerI) => {
          playerI.socket.emit('changeFood', {
            playerNum: player.number,
            amount: tileValue
          })
          playerI.socket.emit('setMapTile', {
            pos,
            value: room.map.getTile(pos.x, pos.y) * 0.5
          })
        })

        room.map.setTile(pos.x, pos.y, room.map.getTile(pos.x, pos.y) * 0.5)
      })

      socket.on('changeFood', (amount) => {
        player.food += amount

        room.players[1 - player.number].socket.emit('changeFood', {
          playerNum: player.number,
          amount
        })
      })

      socket.on('endTurn', () => {
        endTurn(room, player)
      })

      socket.on('disconnect', () => {
        console.log('user disconnected')
        if (room === null) return

        room.players.forEach((playerI) => {
          playerI.socket.emit('endGame')
        })

        this.rooms[room.name] = null
        room = null
      })
    })

    function endTurn (room, player) {
      let win = false

      room.players.forEach((playerI) => {
        if (playerI.health <= 0) {
          playerI.socket.emit('lose')
          room.players[1 - playerI.number].socket.emit('win')

          win = true
        }
      })

      if (win) return

      for (let i = 0; i < (room.map.width * room.map.height) / 5; i++) {
        let pos = {
          x: Math.floor(Math.random() * 16),
          y: Math.floor(Math.random() * 9)
        }

        let value = Math.min(room.map.getTile(pos.x, pos.y) * 1.05, 1)

        room.players.forEach((playerI) => {
          playerI.socket.emit('setMapTile', {
            pos,
            value
          })
        })

        room.map.setTile(pos.x, pos.y, value)
      }

      room.players[1 - player.number].socket.emit('setTurn', 1 - player.number)
    }
  }
}
