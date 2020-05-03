export default class {
  constructor(value = 0, options = {}) {
    this.value = value;
    this.speed = 0;
    this.sampling = options.sampling || 0.7;
  }

  update() {
    this.value += this.speed;
    this.speed *= this.sampling;
  }

  get() {
    return this.value;
  }

  set(value) {
    this.speed += value;
  }
}
