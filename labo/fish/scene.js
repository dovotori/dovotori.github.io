import WebgpuScene from '../lib/webgl/webgpu/WebgpuScene.js';
import { Compute } from './compute.js';

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    // anti clock wise important (- -> bottom)
    // point haut -> point bas -> decalage vers la droite -> point haut -> point bas...
    const vertices = new Float32Array([0, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);

    this.pointCount = vertices.length / 2;

    const device = this.context.getDevice();

    this.vertexBuffer = device.createBuffer({
      label: 'vertex buffer',
      size: vertices.byteLength,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.vertexBuffer, /*bufferOffset=*/ 0, vertices);

    const vertexBufferLayout = {
      arrayStride: 8, // (Float32Array.BYTES_PER_ELEMENT = 4) * 2 XY
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
      primitive: {
        topology: 'triangle-strip',
        cullMode: 'back',
      },
    });

    this.compute = new Compute();
    await this.compute.init(100);
  }

  update() {
    super.update();

    this.compute.run();
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

    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.draw(this.pointCount);

    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  resize(size) {}

  destroy() {
    super.destroy();
  }
}
