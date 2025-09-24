export default {
  slug: 'particule3d',
  shaders: [
    '/wgsl/fragment/f_particule_3d.js',
    '/wgsl/vertex/v_particule_3d.js',
    '/wgsl/skybox.js',
    '/wgsl/postprocess.js',
  ],
  assets: [
    '/gltf/suzanne.glb',
    '/gltf/sphere.gltf',
    '/gltf/cube.glb',
    '/textures/pos-x.webp',
    '/textures/neg-x.webp',
    '/textures/pos-y.webp',
    '/textures/neg-y.webp',
    '/textures/pos-z.webp',
    '/textures/neg-z.webp',
  ],
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
  particules: {
    workgroupSize: 1, // 1 - 256 // depend on computer limitations
    workgroupCount: 10,
    size: 200,
    speed: 10.0,
  },
};
