export default {
  slug: 'terrain',
  shaders: [
    '/camera/basique3d.js',
    '/camera/vertexColor.js',
    '/screen/blurOnePass.js',
    '/screen/screen.js',
    '/screen/debug.js',
    '/particules/pass1.js',
    '/particules/pass2Camera.js',
  ],
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
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
};
