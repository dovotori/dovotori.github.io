class Pass {
  constructor() {
    this.renderPassDescriptor = null;
    this.depthTextureFormat = "depth32float";
  }

  setup = () => {
    // renderpass descriptor
    this.renderPassDescriptor = {
      label: "Gltf",
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
    this.renderPassDescriptor.colorAttachments[0].resolveTarget = currentView;
    this.renderPassDescriptor.colorAttachments[0].view = renderTargetView;
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  };

  getRenderPassDescriptor = () => this.renderPassDescriptor;
}

export default Pass;
