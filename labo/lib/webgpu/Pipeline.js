class Pipeline {
  constructor(sampleCount = 4, depthTextureFormat = "depth32float") {
    this.pipeline = null;
    this.renderPassDescriptor = null;
    this.depthTextureFormat = depthTextureFormat;
    this.sampleCount = sampleCount;
  }

  async setup(device, program, config, buffersLayout, fragmentFormat, bindGroupLayouts) {
    const pipelineLayout = device.createPipelineLayout({
      label: "Pipeline layout",
      bindGroupLayouts,
    });

    const descriptor = {
      label: "Gltf pipeline",
      layout: pipelineLayout,
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: buffersLayout,
      },
      fragment: {
        module: program.fragment,
        entryPoint: "f_main",
        targets: fragmentFormat,
      },
      primitive: config,
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.depthTextureFormat,
      },
      multisample: {
        count: this.sampleCount,
      },
    };
    this.pipeline = await device.createRenderPipelineAsync(descriptor);
  }

  setRenderPassDescriptor = (colorAttachements) => {
    // renderpass descriptor
    this.renderPassDescriptor = {
      label: "Gltf Pass Descriptor",
      colorAttachments: colorAttachements,
      depthStencilAttachment: {
        view: null,
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
        stencilClearValue: 0,
        // stencilLoadOp: 'clear',
        // stencilStoreOp: 'store',
      },
    };
  };

  update = (targetViews, depthTextureView) => {
    targetViews.forEach((currentView, i) => {
      this.renderPassDescriptor.colorAttachments[i].view = currentView;
    });
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  };

  get = () => this.pipeline;

  getRenderPassDescriptor = () => this.renderPassDescriptor;

  getDepthTextureFormat = () => this.depthTextureFormat;

  // work only with compute pipeline
  // getBindGroupLayout = (index) => {
  //   return this.pipeline.getBindGroupLayout(index);
  // };
}

export default Pipeline;
