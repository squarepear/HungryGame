export default class ControlManager {
  constructor (game) {
    this.game = game
  }

  initControls (sketch) {
    this.keys = []
    this.keysPressed = []
    this.keysReleased = []

    sketch.keyPressed = () => {
      this.keys[sketch.keyCode] = true
      this.keysPressed[sketch.keyCode] = true

      return false
    }

    sketch.keyReleased = () => {
      this.keys[sketch.keyCode] = false
      this.keysReleased[sketch.keyCode] = true

      return false
    }
  }

  update () {
    this.keysPressed = []
    this.keysReleased = []
  }

  getKey (keyCode) {
    return this.keys[keyCode]
  }

  getKeyPressed (keyCode) {
    return this.keysPressed[keyCode]
  }

  getKeyReleased (keyCode) {
    return this.keysReleased[keyCode]
  }
}
