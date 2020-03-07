export default class {
  constructor() {
    this.fps = 1000 / 40;
    this.lastFrame = new Date().getTime();
    this.ref = null;
  }

  start = () => {
    const now = new Date().getTime();
    const milli = now - this.lastFrame;

    if (milli > this.fps) {
      this.callback();
      this.lastFrame = now;
    }
    this.ref = window.requestAnimationFrame(this.start);
  };

  setCallback(callback) {
    this.callback = callback;
  }

  setFps(fps) {
    this.fps = fps;
  }

  stop() {
    window.cancelAnimationFrame(this.ref);
  }
}
