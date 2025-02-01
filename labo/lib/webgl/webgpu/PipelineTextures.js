class PipelineTextures {
  constructor(sampleCount = 4) {
    this.renderTarget = null;
    this.renderTargetView = null;
    this.depthTexture = null;
    this.depthTextureView = null;
    this.sampleCount = sampleCount; // ?? Pipeline multisample, should get from pipeline
  }

  setup(device, format, size, depthFormat = 'depth32float') {
    this.setupRender(device, format, size);
    this.setupDepth(device, depthFormat, size);
  }

  resize = (device, format, size, depthFormat = 'depth32float') => {
    this.renderTarget.destroy();
    this.depthTexture.destroy();
    this.setup(device, format, size, depthFormat);
  };

  setupRender = (device, format, { width, height }) => {
    // Resize the multisampled render target to match the new canvas size.
    this.renderTarget = device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.renderTargetView = this.renderTarget.createView({
      label: 'SceneTextureView',
    });
  };

  setupDepth = (device, format, { width, height }) => {
    this.depthTexture = device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.depthTextureView = this.depthTexture.createView({
      label: 'SceneDepthTextureView',
    });
  };

  getRenderTargetView = () => this.renderTargetView;
  getDepthTextureView = () => this.depthTextureView;
}

export default PipelineTextures;
