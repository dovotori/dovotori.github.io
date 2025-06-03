import Program from './Program.js';

export default class WebgpuScene {
  constructor(context, config) {
    this.context = context;
    this.config = config;
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
  }

  render() {
    // Handle render logic if necessary
  }
}
