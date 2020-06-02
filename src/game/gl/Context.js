class Context {
  static checkWebGl(canvas) {
    const contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    let gl;
    for (let i = 0; i < contexts.length; i += 1) {
      try {
        gl = canvas.getContext(contexts[i], { preserveDrawingBuffer: true });
      } catch (e) {
        console.error(e);
      }
      if (gl) {
        break;
      }
    }
    return gl;
  }

  constructor(canvas) {
    this.gl = Context.checkWebGl(canvas);
    if (this.gl) {
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.clearDepth(1.0);
      this.gl.depthFunc(this.gl.LESS);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

      this.gl.getExtension("WEBGL_depth_texture");
    } else {
      console.debug("context not found");
    }
  }

  get() {
    return this.gl;
  }
}

export default Context;
