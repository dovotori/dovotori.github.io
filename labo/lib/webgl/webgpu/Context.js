class Context {
  constructor() {
    this.context = null;
    this.support = {
      webgpu: false,
      device: false,
    };
    this.device = null;
    this.format = null;
  }

  async setup(canvas) {
    if (!navigator.gpu) return;
    this.canvas = canvas;
    this.context = canvas.getContext('webgpu');
    this.support.webgpu = true;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return;
    console.info(adapter.limits);
    this.support.device = true;
    this.device = await adapter.requestDevice();
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: 'premultiplied', // to have transparent background,
    });
  }

  get = () => this;

  getContext = () => this.context;

  getCanvasFormat = () => this.format;

  getSupport = () => this.support;

  getDevice = () => this.device;

  getCurrentTexture = () => this.context.getCurrentTexture();
}

export default Context;
