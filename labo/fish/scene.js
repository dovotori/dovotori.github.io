import WebgpuScene from '../lib/webgl/webgpu/WebgpuScene.js';

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const nodes = [0, 0, 0, 0];
    const data = new Float32Array(nodes);

    const device = this.context.getDevice();
    this.vertex = device.createBuffer({
      label: 'vertex buffer',
      size: data.byteLength,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const vertexBufferLayout = {
      arrayStride: 8,
      attributes: [
        {
          format: 'float32x2',
          offset: 0,
          shaderLocation: 0, // Position, see vertex shader
        },
      ],
    };

    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    console.log({ canvasFormat, programs });

    this.pipeline = device.createRenderPipeline({
      label: 'Fish pipeline',
      layout: 'auto',
      vertex: {
        module: programs.v_fish.get(),
        entryPoint: 'v_main',
        buffers: [vertexBufferLayout],
      },
      fragment: {
        module: programs.f_fish.get(),
        entryPoint: 'f_main',
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
    });
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const encoder = device.createCommandEncoder({
      label: 'Fish Command Encoder',
    });
    const pass = encoder.beginRenderPass({
      label: 'Fish Pass Descriptor',
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear', // 'load' -> draw hover / 'clear'
          storeOp: 'store', // 'store' -> save // 'discard' maybe for save in tex
        },
      ],
    });
    pass.setPipeline(this.pipeline);

    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  destroy() {
    super.destroy();
  }
}
