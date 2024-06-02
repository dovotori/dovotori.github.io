class Pipeline {
  constructor() {
    this.pipeline = null;
    this.renderPassDescriptor = null;
    this.depthTextureFormat = "depth32float";
  }

  async setup(device, vertex, fragment, config, buffersLayout, canvasFormat) {
    const descriptor = {
      label: "Gltf pipeline",
      layout: "auto",
      vertex: {
        module: vertex,
        entryPoint: "v_main",
        buffers: buffersLayout,
      },
      fragment: {
        module: fragment,
        entryPoint: "f_main",
        targets: [
          {
            format: canvasFormat,
            // alpha blend behavior
            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
              },
              alpha: {
                // This just prevents the canvas from having alpha "holes" in it.
                srcFactor: "one",
                dstFactor: "one",
              },
            },
          },
        ],
      },
      primitive: config,
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.depthTextureFormat,
      },
      multisample: {
        count: 4,
      },
    };
    this.pipeline = await device.createRenderPipelineAsync(descriptor);
  }

  setupRenderPassDescriptor = () => {
    // renderpass descriptor
    this.renderPassDescriptor = {
      label: "gltf",
      colorAttachments: [
        {
          view: null,
          resolveTarget: null, // context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear", // 'load' -> draw hover / 'clear'
          storeOp: "store", // 'store' -> save // 'discard' maybe for save in tex
        },
      ],
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

  update = (currentView, renderTargetView, depthTextureView) => {
    this.renderPassDescriptor.colorAttachments[0].view = renderTargetView;
    this.renderPassDescriptor.colorAttachments[0].resolveTarget = currentView;
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  };

  get = () => this.pipeline;

  getRenderPassDescriptor = () => this.renderPassDescriptor;

  getDepthTextureFormat = () => this.depthTextureFormat;
}

export default Pipeline;
