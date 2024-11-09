export default class {
  constructor() {
    this.fps = 1000 / 40;
    this.firstFrame = new Date().getTime();
    this.lastFrame = this.firstFrame;
    this.ref = null;
  }

  start = () => {
    const now = new Date().getTime();
    const milli = now - this.lastFrame;
    if (this.callbackNoFps) this.callbackNoFps();
    if (milli > this.fps) {
      this.callback(now - this.firstFrame);
      this.lastFrame = now;
    }
    this.ref = window.requestAnimationFrame(this.start);
  };

  setCallback(callback) {
    this.callback = callback;
  }

  setCallbackNoFps(callback) {
    this.callbackNoFps = callback;
  }

  setFps(fps) {
    this.fps = fps;
  }

  stop() {
    window.cancelAnimationFrame(this.ref);
  }
}
