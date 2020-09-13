export default class {
  constructor(times, interpolationType = 'LINEAR', speed = 1000) {
    this.times = times;
    this.setTimes(speed);
  }

  update() {
    const now = new Date().getTime();
    let currentTime = now - this.lastFrame;

    if (currentTime > this.completeDuration) {
      this.lastFrame = now;
      this.currentIndex = 0;
      this.nextStep = this.timeSteps[this.currentIndex];
      currentTime = 0;
    }

    while (currentTime >= this.nextStep && this.currentIndex < this.lastTimeIndex) {
      this.currentIndex++;
      this.nextStep = this.timeSteps[this.currentIndex];
    }

    const nextTime = this.timeSteps[this.currentIndex];
    const previousTime = this.currentIndex === 0 ? 0 : this.timeSteps[this.currentIndex - 1];
    this.interpolationValue = (currentTime - previousTime) / (nextTime - previousTime);
  }

  setSpeed(millis) {
    this.setTimes(millis);
  }

  setTimes = (speed) => {
    this.timeSteps = this.times.map((time) => time * speed);
    this.currentIndex = 0;
    this.nextStep = this.timeSteps[this.currentIndex];
    this.interpolationValue = 0;
    this.lastFrame = new Date().getTime();
    this.lastTimeIndex = this.times.length - 1;
    this.completeDuration = this.timeSteps[this.lastTimeIndex];
  };

  getIndex() {
    return this.currentIndex;
  }

  get() {
    return this.interpolationValue;
  }
}
