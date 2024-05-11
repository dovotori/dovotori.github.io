export default class {
  constructor(value = 0, sampling = 0.04) {
    this.value = value
    this.target = value
    this.sampling = sampling
    this.threshold = 0.000001
  }

  update() {
    if (Math.abs(this.value - this.target) > this.threshold) {
      this.value += (this.target - this.value) * this.sampling
    } else {
      this.value = this.target
    }
  }

  get() {
    return this.value
  }

  set(value) {
    this.target = value
  }

  setDirect(value) {
    this.value = value
  }
}
