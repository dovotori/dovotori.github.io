class Textures {
  constructor() {
    this.renderTarget = null
    this.renderTargetView = null
    this.depthTexture = null
    this.depthTextureView = null
    this.sampleCount = 4 // ??
  }

  setup(device, format, depthFormat, size) {
    this.setupRender(device, format, size)
    this.setupDepth(device, depthFormat, size)
  }

  resize = (device, format, depthFormat, size) => {
    this.renderTarget.destroy()
    this.depthTexture.destroy()
    this.setup(device, format, depthFormat, size)
  }

  setupRender = (device, format, { width, height }) => {
    // Resize the multisampled render target to match the new canvas size.
    this.renderTarget = device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format,
      usage: window.GPUTextureUsage.RENDER_ATTACHMENT,
    })
    this.renderTargetView = this.renderTarget.createView()
  }

  setupDepth = (device, format, { width, height }) => {
    this.depthTexture = device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format,
      usage: window.GPUTextureUsage.RENDER_ATTACHMENT | window.GPUTextureUsage.TEXTURE_BINDING,
    })
    this.depthTextureView = this.depthTexture.createView()
  }

  getRenderTargetView = () => this.renderTargetView
  getDepthTextureView = () => this.depthTextureView
}

export default Textures
