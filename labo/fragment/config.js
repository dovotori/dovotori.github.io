export default {
  slug: 'fragment',
  shaders: [
    '/camera/basique3d.js',
    '/camera/vertexColor.js',
    '/screen/blurOnePass.js',
    '/screen/screen.js',
    '/screen/debug.js',
  ],
  postprocess: {
    bloom: true,
  },
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: 0, y: 0, z: 700 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 1000,
    angle: 60,
  },
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
};
