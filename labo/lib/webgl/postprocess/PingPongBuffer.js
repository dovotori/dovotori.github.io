import Fbo from '../gl/Fbo';

export default class {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    this.fbos = [];
    this.currentFbo = 0;
    const extension = null;
    this.fbos[0] = new Fbo(gl, width, height, useDepth, extension, 0);
    this.fbos[1] = new Fbo(gl, width, height, useDepth, extension, 1);
  }

  start() {
    this.fbos[this.currentFbo].start();
  }

  end() {
    this.fbos[this.currentFbo].end();
  }

  swap() {
    this.currentFbo = this.currentFbo === 0 ? 1 : 0;
  }

  resize(box) {
    this.fbos[0].resize(box);
    this.fbos[1].resize(box);
  }

  getTexture() {
    return this.fbos[this.currentFbo].getTexture();
  }

  getDepthTexture() {
    return this.fbos[this.currentFbo].getDepthTexture();
  }
}
