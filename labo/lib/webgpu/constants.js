// Todo more index is small, less it changed
export const BindGroupLayouts = {
  CAMERA: 0,
  TRANSFORM: 1,
  MATERIAL: 2,
  LIGHTS: 3,
};

// alpha blend behavior
export const blend = {
  color: {
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
  },
  alpha: {
    // This just prevents the canvas from having alpha "holes" in it.
    srcFactor: "one",
    dstFactor: "one-minus-src-alpha",
  },
};

export const shadowCompareSample = {
  magFilter: "nearest",
  minFilter: "nearest",
  mipmapFilter: "nearest",
  compare: "less", // For shadow mapping (depth comparison)
  addressModeU: "clamp-to-edge",
  addressModeV: "clamp-to-edge",
  addressModeW: "clamp-to-edge",
};

export const defaultColorAttachment = {
  view: null,
  clearValue: { r: 0, g: 0, b: 0, a: 0 },
  loadOp: "clear", // 'load' -> draw hover / 'clear'
  storeOp: "store", // 'store' -> save // 'discard' maybe for save in tex
};

export const defaultMsaaFourSamplesColorAttachment = {
  view: null,
  resolveTarget: null, // context.getCurrentTexture().createView(),
  clearValue: { r: 0, g: 0, b: 0, a: 0 },
  loadOp: "clear", // 'load' -> draw hover / 'clear'
  storeOp: "store", // 'store' -> save // 'discard' maybe for save in tex
};

export const defaultDepthAttachment = {
  view: null,
  depthClearValue: 1.0,
  depthLoadOp: "clear",
  depthStoreOp: "store",
  stencilClearValue: 0,
  // stencilLoadOp: 'clear',
  // stencilStoreOp: 'store',
};
