export default class {
  constructor(value = 0, options = {}) {
    this.value = value
    this.sampling = options.sampling || 0.7
  }

  update() {
    if (this.value !== 0) {
      if (this.value < 0.000001) {
        this.value = 0
      }
      this.value *= this.sampling
    }
  }

  get() {
    return this.value
  }

  set(value) {
    this.value = value
  }
}
