export default class {
  constructor(keys) {
    this.keys = keys
    this.oneKeysPressed = {}
    this.keysPressed = {}
    this.keysUp = {}
    this.charges = {}

    Object.keys(this.keys).forEach((key) => {
      this.keysPressed[this.keys[key]] = false
      this.keysUp[this.keys[key]] = false
      this.oneKeysPressed[this.keys[key]] = false
      this.charges[this.keys[key]] = 0
    })

    document.addEventListener('keydown', this.onKeyPress, false)
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  cancel() {
    document.removeEventListener('keydown', this.onKeyPress, false)
    document.removeEventListener('keyup', this.onKeyUp, false)
  }

  start() {
    Object.keys(this.keys).forEach((key) => {
      if (this.keysPressed[this.keys[key]]) {
        this.charges[this.keys[key]] += 1
      }
    })
  }

  end() {
    Object.keys(this.keys).forEach((key) => {
      if (this.keysPressed[this.keys[key]] && this.keysUp[this.keys[key]]) {
        this.charges[this.keys[key]] = 0
        this.keysPressed[this.keys[key]] = false
        this.keysUp[this.keys[key]] = false
      }
    })
  }

  onKeyPress = (e) => {
    if (this.keysPressed[e.keyCode] !== undefined) {
      e.preventDefault()
      this.keysPressed[e.keyCode] = true
      this.oneKeysPressed[e.keyCode] = true
    }
  }

  onKeyUp = (e) => {
    if (this.keysPressed[e.keyCode] !== undefined) {
      e.preventDefault()
      this.keysUp[e.keyCode] = true
    }
  }

  getCharge(code) {
    return this.charges[code]
  }

  resetCharge(code) {
    this.charges[code] = 0
  }

  isPressed(code) {
    return this.charges[code] > 0
  }

  isPressedOne(code) {
    return this.charges[code] === 1
  }

  isUp(code) {
    return this.keysUp[code]
  }
}
