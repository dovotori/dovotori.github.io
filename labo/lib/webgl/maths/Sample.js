export default class {
  constructor(times) {
    this.speed = 1000; // en ms
    this.times = times.map((time) => time * this.speed); // 1s per step
    this.lastFrame = new Date().getTime();
    this.currentIndex = 0;
    this.nextStep = this.times[this.currentIndex];
    this.interpolationValue = 0;
  }

  update() {
    const now = new Date().getTime();
    let currentTime = now - this.lastFrame;
    const lastTimeIndex = this.times.length - 1;
    const duration = this.times[lastTimeIndex];

    if (currentTime > duration) {
      this.lastFrame = now;
      this.currentIndex = 0;
      this.nextStep = this.times[this.currentIndex];
      currentTime = 0;
    }

    while (currentTime >= this.nextStep && this.currentIndex < lastTimeIndex) {
      this.currentIndex++;
      this.nextStep = this.times[this.currentIndex];
    }

    const nextTime = this.times[this.currentIndex];
    const previousTime = this.times[this.currentIndex - 1];
    this.interpolationValue = (currentTime - previousTime) / (nextTime - previousTime);
  }

  setSpeed(millis) {
    this.speed = millis;
    this.setTimes();
  }

  setTimes = () => {
    this.times = this.times.map((time) => time * this.speed);
  };

  getIndex() {
    return this.currentIndex;
  }

  get() {
    return this.interpolationValue;
  }
}
