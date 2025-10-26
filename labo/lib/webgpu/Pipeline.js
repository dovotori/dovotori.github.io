import { blend } from './constants';

class Pipeline {
  constructor(sampleCount = 4, depthTextureFormat = 'depth32float') {
    this.pipeline = null;
    this.renderPassDescriptor = null;
    this.depthTextureFormat = depthTextureFormat;
    this.sampleCount = sampleCount;
  }

  async setup(device, program, config, buffersLayout, canvasFormat, bindGroupLayouts) {
    const pipelineLayout = device.createPipelineLayout({
      label: 'Pipeline layout',
      bindGroupLayouts,
    });

    const descriptor = {
      label: 'Gltf pipeline',
      layout: pipelineLayout,
      vertex: {
        module: program.vertex,
        entryPoint: 'v_main',
        buffers: buffersLayout,
      },
      fragment: {
        module: program.fragment,
        entryPoint: 'f_main',
        targets: [
          {
            format: canvasFormat,
            blend,
          },
        ],
      },
      primitive: config,
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: this.depthTextureFormat,
      },
      multisample: {
        count: this.sampleCount,
      },
    };
    this.pipeline = await device.createRenderPipelineAsync(descriptor);
  }

  setupRenderPassDescriptor = () => {
    // renderpass descriptor
    this.renderPassDescriptor = {
      label: 'Gltf Pass Descriptor',
      colorAttachments: [
        {
          view: null,
          resolveTarget: null, // context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear', // 'load' -> draw hover / 'clear'
          storeOp: 'store', // 'store' -> save // 'discard' maybe for save in tex
        },
      ],
      depthStencilAttachment: {
        view: null,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
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

  get = () => this.pipeline;

  getRenderPassDescriptor = () => this.renderPassDescriptor;

  getDepthTextureFormat = () => this.depthTextureFormat;

  // work only with compute pipeline
  // getBindGroupLayout = (index) => {
  //   return this.pipeline.getBindGroupLayout(index);
  // };
}

export default Pipeline;
