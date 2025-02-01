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
    srcFactor: 'src-alpha',
    dstFactor: 'one-minus-src-alpha',
  },
  alpha: {
    // This just prevents the canvas from having alpha "holes" in it.
    srcFactor: 'one',
    dstFactor: 'one',
  },
};
