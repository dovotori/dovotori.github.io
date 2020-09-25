export default class {
  constructor(times, interpolationType = 'LINEAR', speed = 1000) {
    this.times = times;
    this.setTimes(speed);
  }

  update(timeInAnimation) {
    this.findIndex(timeInAnimation);
    if (this.index === 0) {
      this.interpolationValue = 0;
    } else if (this.index === this.times.length) {
      this.interpolationValue = this.timeSteps[this.times.length - 1];
    } else {
      const nextTime = this.timeSteps[this.index];
      const previousTime = this.timeSteps[this.index - 1];
      this.interpolationValue = (timeInAnimation - previousTime) / (nextTime - previousTime);
    }
  }

  findIndex = (timeInAnimation) => {
    let i = 0;
    let timeStep = this.timeSteps[i];
    if (timeStep === 0) {
      i++;
      timeStep = this.timeSteps[i];
    }
    while (timeStep && timeInAnimation > timeStep) {
      i++;
      timeStep = this.timeSteps[i];
    }
    this.index = i;
  };

  setSpeed(millis) {
    this.setTimes(millis);
  }

  setTimes = (speed) => {
    this.timeSteps = this.times.map((time) => time * speed);
    this.index = 0;
    this.interpolationValue = 0;
  };

  getIndex() {
    return this.index;
  }

  get() {
    return this.interpolationValue;
  }
}
