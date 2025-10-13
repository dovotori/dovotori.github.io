export default {
  slug: "fish",
  shaders: ["/wgsl/fragment/f_fish.js", "/wgsl/vertex/v_fish.js"],
  canvas: {
    width: 1024,
    height: 1024,
  },
  useWebGpu: true,
};
