export default {
  slug: 'particule3d',
  shaders: ['/wgsl/fragment/f_particule_3d.js', '/wgsl/vertex/v_particule_3d.js'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  useWebGpu: true,
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  camera: {
    // perspective
    position: { x: 0, y: 0, z: 1500 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 4000,
    angle: 60,
  },
};
