export class PostProcess {
  constructor(context) {
    this.context = context;
    this.pipeline = undefined;
    this.renderTargetFormat = 'rgba8unorm';
    this.sampleCount = 1; // should be 1 for a render target used as texture
  }

  setup(program) {
    const device = this.context.getDevice();
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.pipeline = device.createRenderPipeline({
      label: 'post process no attributes',
      layout: 'auto',
      vertex: { module: program },
      fragment: {
        module: program,
        targets: [{ format: presentationFormat }],
      },
      multisample: {
        count: this.sampleCount,
      },
    });

    this.sampler = device.createSampler({
      minFilter: 'linear',
      magFilter: 'linear',
    });

    this.renderPassDescriptor = {
      label: 'post process render pass',
      colorAttachments: [{ loadOp: 'clear', storeOp: 'store' }],
    };
  }

  setupRenderTexture(device, canvasSize) {
    this.renderTarget = device.createTexture({
      size: canvasSize,
      format: this.renderTargetFormat,
      sampleCount: this.sampleCount,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.renderTargetView = this.renderTarget.createView();

    this.bindGroup = device.createBindGroup({
      label: 'post process bind group',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.renderTargetView },
        { binding: 1, resource: this.sampler },
      ],
    });
  }

  resize = (device, canvasSize) => {
    this.renderTarget?.destroy();
    this.setupRenderTexture(device, canvasSize);
  };

  updateTexture(dstTextureView) {
    this.renderPassDescriptor.colorAttachments[0].view = dstTextureView;
  }

  render(encoder) {
    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(3);
    pass.end();
  }

  getPipeline() {
    return this.pipeline;
  }

  getRenderTargetView() {
    return this.renderTargetView;
  }

  getRenderTargetFormat() {
    return this.renderTargetFormat;
  }
}
