export default class {
  constructor(value = 0, options = {}) {
    this.value = value;
    this.speed = 0;
    this.sampling = options.sampling || 0.7;
  }

  update() {
    this.value += this.speed;
    this.speed *= this.sampling;

    // const tensionForce = -tension * (currentPosition - toPosition)
    // const dampingForce = -config.friction * velocity
    // const acceleration = (tensionForce + dampingForce) / mass
    // velocity = velocity + acceleration
    // position = position + velocity
    // if (Math.abs(position - to.progress) > precision {
    //   window.requestAnimationFrame(update)
    // }
  }

  get() {
    return this.value;
  }

  set(value) {
    this.speed += value;
  }
}
