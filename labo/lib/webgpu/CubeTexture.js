export class CubeTexture {
  constructor(context) {
    this.context = context;
    this.texture = null;
  }

  createTextureFromSources(device, sources, options = {}) {
    // Assume are sources all the same size so just use the first one for width and height
    const source = sources[0];
    this.texture = device.createTexture({
      format: "rgba8unorm",
      mipLevelCount: options.mips
        ? this.numMipLevels(source.width, source.height)
        : 1,
      size: [source.width, source.height, sources.length],
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.copySourcesToTexture(device, this.texture, sources, options);
  }

  numMipLevels(...sizes) {
    const maxSize = Math.max(...sizes);
    return (1 + Math.log2(maxSize)) | 0;
  }

  copySourcesToTexture(device, texture, sources, { flipY } = {}) {
    sources.forEach((source, layer) => {
      device.queue.copyExternalImageToTexture(
        { source, flipY },
        { texture, origin: [0, 0, layer] },
        { width: source.width, height: source.height },
      );
    });
    // if (texture.mipLevelCount > 1) {
    //   generateMips(device, texture);
    // }
  }

  get() {
    return this.texture;
  }

  getSampler(device) {
    return device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
    });
  }

  getView() {
    return this.texture.createView({ dimension: "cube" });
  }

  createOne(device, sources, index = 0) {
    const source = sources[index];
    const texture = device.createTexture({
      size: [source.width, source.height],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source, flipY: false },
      { texture, origin: [0, 0, 0] },
      { width: source.width, height: source.height },
    );
    this.texture = texture;
  }

  getViewOne() {
    return this.texture.createView();
  }
}
