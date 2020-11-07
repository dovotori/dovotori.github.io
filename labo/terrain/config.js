export default {
  slug: 'terrain',
  shaders: ['/camera/terrain.js'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: 0, y: 40, z: 180 },
    target: { x: 20, y: 0, z: 20 },
    near: 1,
    far: 200,
    angle: 60,
  },
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  width: 40,
  height: 40,
};
