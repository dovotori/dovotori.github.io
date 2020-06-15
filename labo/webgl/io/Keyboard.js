export default class {
  constructor(inputs) {
    this.inputs = inputs;
    this.oneKeysPressed = {};
    this.keysPressed = {};
    this.keysUp = {};
    this.charges = {};

    Object.keys(this.inputs).forEach((key) => {
      this.keysPressed[this.inputs[key]] = false;
      this.keysUp[this.inputs[key]] = false;
      this.oneKeysPressed[this.inputs[key]] = false;
      this.charges[this.inputs[key]] = 0;
    });

    document.addEventListener("keydown", this.onKeyPress, false);
    document.addEventListener("keyup", this.onKeyUp, false);
  }

  cancel() {
    document.removeEventListener("keydown", this.onKeyPress, false);
    document.removeEventListener("keyup", this.onKeyUp, false);
  }

  start() {
    Object.keys(this.inputs).forEach((key) => {
      if (this.keysPressed[this.inputs[key]]) {
        this.charges[this.inputs[key]] += 1;
      }
    });
  }

  end() {
    Object.keys(this.inputs).forEach((key) => {
      if (this.keysPressed[this.inputs[key]] && this.keysUp[this.inputs[key]]) {
        this.charges[this.inputs[key]] = 0;
        this.keysPressed[this.inputs[key]] = false;
        this.keysUp[this.inputs[key]] = false;
      }
    });
  }

  onKeyPress = (e) => {
    if (this.inputs[e.keyCode]) {
      e.preventDefault();
      const key = this.inputs[e.keyCode];
      this.keysPressed[key] = true;
      this.oneKeysPressed[key] = true;
    }
  };

  onKeyUp = (e) => {
    if (this.inputs[e.keyCode]) {
      e.preventDefault();
      const key = this.inputs[e.keyCode];
      this.keysUp[key] = true;
    }
  };

  getCharge(code) {
    return this.charges[code];
  }

  resetCharge(code) {
    this.charges[code] = 0;
  }

  isPressed(code) {
    return this.charges[code] > 0;
  }

  isPressedOne(code) {
    return this.charges[code] === 1;
  }

  isUp(code) {
    return this.keysUp[code];
  }
}
