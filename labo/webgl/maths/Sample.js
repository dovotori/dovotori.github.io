export default class {
  constructor(times) {
    this.times = times.map((time) => time * 1000);
    this.duration = this.times[this.times.length - 1];
    this.lastFrame = new Date().getTime();
    this.currentIndex = 0;
    this.nextStep = this.times[this.currentIndex];
    this.interpolationValue = 0;
  }

  update() {
    const now = new Date().getTime();
    let currentTime = now - this.lastFrame;

    if (currentTime > this.duration) {
      this.lastFrame = now;
      this.currentIndex = 0;
      this.nextStep = this.times[this.currentIndex];
      currentTime = 0;
    }

    while (
      currentTime >= this.nextStep &&
      this.currentIndex < this.times.length - 1
    ) {
      this.currentIndex++;
      this.nextStep = this.times[this.currentIndex];
    }

    const nextTime = this.times[this.currentIndex];
    const previousTime = this.times[this.currentIndex - 1];
    this.interpolationValue =
      (currentTime - previousTime) / (nextTime - previousTime);
  }

  getIndex() {
    return this.currentIndex;
  }

  get() {
    return this.interpolationValue;
  }
}
