export default class {
  constructor(value = 0, sampling) {
    this.value = value;
    this.target = value;
    this.sampling = sampling || 0.04;
  }

  update() {
    this.value += (this.target - this.value) * this.sampling;
  }

  get() {
    return this.value;
  }

  set(value) {
    this.target = value;
  }

  setDirect(value) {
    this.value = value;
  }
}
