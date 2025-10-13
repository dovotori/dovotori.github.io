export default {
  slug: "fragment",
  shaders: [
    "/camera/vertexColor.js",
    "/screen/blurOnePass.js",
    "/screen/bloom.js",
    "/screen/screen.js",
  ],
  postprocess: {
    bloom: {
      scale: 0.7,
      threshold: 0.1,
      blur: {
        size: 0.1,
        intensity: 1.2,
      },
    },
  },
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: 0, y: 0, z: 100 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  controls: {
    fullscreen: { buttonId: "fullscreen-toggle-btn" },
  },
};
