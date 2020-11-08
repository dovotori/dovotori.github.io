export default {
  slug: 'terrain',
  shaders: ['/camera/terrain.js', '/camera/instancing.js'],
  assets: [`/gltf/three.gltf`],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: 0, y: 2, z: 4 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  width: 10,
  height: 10,
};
