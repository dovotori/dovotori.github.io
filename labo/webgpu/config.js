export default {
  slug: 'webgpu',
  shaders: ['/wgsl/vertex/v_gltf.js', '/wgsl/fragment/f_gltf.js'],
  assets: ['/gltf/paysage.gltf'],
  // assets: ['/gltf/head.gltf'],
  // assets: ['/gltf/headinterleaved.gltf'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: 0, y: 4, z: 30 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  lampes: [
    {
      type: 0,
      position: { x: 0.5, y: 4, z: 0.3 },
      ambiant: [1, 0.5, 0.8],
      diffuse: [1, 0.9, 0.9],
      specular: [1, 1, 1],
      strength: 1,
      brillance: 1,
    },
    {
      type: 0,
      position: { x: -2, y: 4, z: -0.2 },
      ambiant: [0.6, 1, 0.8],
      strength: 1.2,
    },
  ],
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  useWebGpu: true,
}
