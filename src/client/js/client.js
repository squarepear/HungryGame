import io from 'socket.io-client'
import p5 from 'p5js/p5.min'

import Game from './Game'

let socket = io()

if (window.localStorage.getItem('playerName')) document.getElementById('playerName').value = window.localStorage.getItem('playerName')

document.getElementById('joinRoomButton').onclick = () => {
  socket.emit('joinRoom', document.getElementById('roomName').value)
  socket.on('joinedRoom', (roomName) => {
    document.getElementById('roomSelect').style.display = 'none'
    document.getElementById('game').style.display = 'grid'

    window.localStorage.setItem('playerName', document.getElementById('playerName').value)

    socket.emit('setName', document.getElementById('playerName').value)
    // eslint-disable-next-line no-new, new-cap
    new p5((sketch) => {
      let game = new Game(sketch, socket)

      sketch.setup = function () {
        let width = sketch.windowHeight * 0.6 * 16 / 9
        let height = sketch.windowHeight * 0.6

        if (width > sketch.windowWidth) {
          width = sketch.windowWidth
          height = sketch.windowWidth * 9 / 16
        }

        sketch.createCanvas(width, height)
      }

      sketch.draw = function () {
        sketch.background(0)
        game.update()
        game.draw()
      }

      sketch.windowResized = function () {
        let width = sketch.windowHeight * 0.6 * 16 / 9
        let height = sketch.windowHeight * 0.6

        if (width > sketch.windowWidth) {
          width = sketch.windowWidth
          height = sketch.windowWidth * 9 / 16
        }

        sketch.resizeCanvas(width, height)
      }
    }, 'p5sketch')
  })
}
