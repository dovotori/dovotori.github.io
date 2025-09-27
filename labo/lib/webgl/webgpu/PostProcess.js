export class PostProcess {
  constructor(context) {
    this.context = context;
    this.pipeline = undefined;
    this.renderTargetFormat = 'rgba8unorm';
    this.sampleCount = 1; // should be 1 for a render target used as texture, multisample is allow only for canvas context texture
    this.renderTargetsCount = 3;
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

  setupRenderTextures(device, canvasSize) {
    this.renderTargets = Array.from({ length: this.renderTargetsCount }).map((_, i) =>
      device.createTexture({
        label: `post process render target ${i}`,
        size: canvasSize,
        format: this.renderTargetFormat,
        sampleCount: this.sampleCount,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      }),
    );
    this.renderTargetViews = this.renderTargets.map((rT) => rT.createView());

    this.bindGroup = device.createBindGroup({
      label: 'post process bind group',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.sampler },
        ...this.renderTargets.map((_, i) => ({
          binding: i + 1,
          resource: this.renderTargetViews[i],
        })),
      ],
    });
  }

  resize = (device, canvasSize) => {
    this.renderTargets?.forEach((t) => t.destroy());
    this.setupRenderTextures(device, canvasSize);
  };

  updateTexture(dstTextureView) {
    // set the canvas context texture as the render target
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

  getRenderTargetView(index) {
    return this.renderTargetViews[index];
  }

  getRenderTargetFormat() {
    return this.renderTargetFormat;
  }

  getRenderTargetsCount() {
    return this.renderTargetsCount;
  }
}
