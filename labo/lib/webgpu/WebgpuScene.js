import Program from "./Program";

export default class WebgpuScene {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.time = 0;
    this.canvasSize = { width: config.canvas.width, height: config.canvas.height };
  }

  async setupAssets(assets) {
    const device = this.context.getDevice();
    const programs = Object.keys(assets.shaders).reduce((acc, cur) => {
      const shader = new Program();
      shader.setup(device, cur, assets.shaders[cur]);
      acc[cur] = shader;
      return acc;
    }, {});

    return {
      programs,
    };
  }

  destroy() {
    // Cleanup resources if necessary
  }

  resize() {
    // Handle resizing logic if necessary
  }

  update() {
    // Handle update logic if necessary
    this.time++;
  }

  render() {
    // Handle render logic if necessary
  }
}
