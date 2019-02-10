'use strict'

import express from 'express'
import http from 'http'
import path from 'path'
import SocketIO from 'socket.io'
import compression from 'compression'
import GameManager from './gameManager'

const app = express()
const server = http.Server(app)
const io = new SocketIO(server)
const port = process.env.PORT || 8080
const roomManager = new GameManager(io)

app.use(compression({}))
app.use(express['static'](path.join(__dirname, '/../client')))

roomManager.init()

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port)
})
