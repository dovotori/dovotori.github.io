import { defaultDepthAttachment } from "./constants";

class Pipeline {
  constructor(sampleCount = 4, depthTextureFormat = "depth32float") {
    this.pipeline = null;
    this.renderPassDescriptor = null;
    this.depthTextureFormat = depthTextureFormat;
    this.sampleCount = sampleCount;
  }

  async setup(device, program, config, buffersLayout, fragmentTargets, bindGroupLayouts) {
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
        targets: fragmentTargets,
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
      depthStencilAttachment: defaultDepthAttachment,
    };
  };

  update = (targetViews, depthTextureView) => {
    for (let i = 0; i < targetViews.length; i++) {
      this.renderPassDescriptor.colorAttachments[i].view = targetViews[i];
    }
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  };

  updateMsaaFourSamples = (currentView, renderTargetView, depthTextureView) => {
    this.renderPassDescriptor.colorAttachments[0].resolveTarget = currentView;
    this.renderPassDescriptor.colorAttachments[0].view = renderTargetView;
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  };

  get = () => this.pipeline;

  getRenderPassDescriptor = () => this.renderPassDescriptor;

  getDepthTextureFormat = () => this.depthTextureFormat;
}

export default Pipeline;
