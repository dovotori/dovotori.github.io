import * as easings from '../utils/easing';

export default class {
  constructor(value = 0) {
    this.value = value;
    this.lastFrame = new Date().getTime();
    this.isFinish = true;
    this.currentStep = 0;
    this.steps = [];
  }

  update() {
    if (!this.isFinish) {
      const step = this.steps[this.currentStep];
      const stepIsFinished = this.updateStep(step);
      
      if (stepIsFinished) {
        if(this.currentStep < this.steps.length - 1) {
          this.currentStep++;
          this.startStep();
        } else {
          this.isFinish = true;
        }
      }
    }
  }

   updateStep({ duration, easingType, end, start }) {
    const now = new Date().getTime();
    const milli = now - this.lastFrame;
    const normalizeDuration = milli / duration;
    const stepIsFinish = normalizeDuration > 1;

    if (!stepIsFinish) {
      const diff = Math.abs(end - start);

      const easingDiff = easings[easingType](milli, 0, diff, duration);
      this.value = start + (easingDiff * Math.sign(end - start));
      console.log('++++',  start, end, diff, easingDiff, this.value);
    } else {
      this.value = end;
    }
    return stepIsFinish;
   }

  get() {
    return this.value;
  }

  startStep() {
    this.lastFrame = new Date().getTime();
  }



  set(start = 0, end = 0, duration = 1000, easingType = "easeInOutCirc") {
    this.steps = [{start, end, duration, easingType }];
    this.isFinish = false;
    this.currentStep = 0;
    this.startStep();
  }

  setSteps(items) {
    this.steps = items.map(item => ({
      start: item.start || 0,
      end: item.end || 0,
      duration: item.duration || 1000,
      easingType: item.easingType || 'easeInOutCirc',
    }));
    this.isFinish = false;
    this.currentStep = 0;
    this.startStep();
  }
}
