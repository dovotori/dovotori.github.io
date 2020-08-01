class Context {
  static checkWebGl(canvas) {
    const contexts = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
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
    this.support = {
      webgl: false,
      depthTexture: false,
    };
    if (this.gl) {
      this.support.webgl = true;
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.clearDepth(1.0);
      this.gl.depthFunc(this.gl.LESS);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

      this.support.depthTexture = !!this.gl.getExtension('WEBGL_depth_texture');

      this.support.drawBuffers =
        !!this.gl.getExtension('WEBGL_draw_buffers') ||
        !!this.gl.getExtension('GL_EXT_draw_buffers') ||
        !!this.gl.getExtension('EXT_draw_buffers');
    }
    console.debug('Webgl support info', this.support);
  }

  get() {
    return this.gl;
  }

  getSupport() {
    return this.support;
  }
}

export default Context;
