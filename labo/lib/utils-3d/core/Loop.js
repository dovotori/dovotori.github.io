export default class {
  constructor() {
    this.fps = 1000 / 40;
    this.firstFrame = Date.now();
    this.lastFrame = this.firstFrame;
    this.ref = null;
  }

  start = () => {
    const now = Date.now();
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
