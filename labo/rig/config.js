export default {
  slug: 'rig',
  shaders: ['/wgsl/vertex/v_gltf_rig.js', '/wgsl/fragment/f_gltf_rig.js'],
  // assets: ['/gltf/paysage.gltf'],
  // assets: ['/gltf/distributedInstances.gltf'],
  assets: ['/gltf/skin.glb'],
  // assets: ["/gltf/plane.gltf"],
  // assets: ["/gltf/head.gltf"],
  // assets: ['/gltf/headinterleaved.gltf'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    // perspective
    position: { x: 0, y: 4, z: 20 },
    target: { x: 0, y: 4, z: 0 },
    near: 1,
    far: 60,
    angle: 60,
  },
  lampes: [
    {
      type: 0,
      position: { x: -20, y: 20, z: -2 },
      target: { x: 0, y: 0, z: 0 },
      ambiant: [1, 1, 1],
      diffuse: [1, 1, 1],
      specular: [1, 1, 1],
      strength: 2,
      brillance: 1,
      near: 1,
      far: 40,
      ortho: { left: -15, right: 15, bottom: -15, top: 15 },
    },
  ],
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  useWebGpu: true,
};
