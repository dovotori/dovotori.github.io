export default {
  slug: 'race',
  assets: ['/textures/noisergb.png', '/gltf/raceship.gltf'],
  shaders: [
    '/camera/road.js',
    '/camera/gltf.js',
    '/camera/roadmountain.js',
    '/camera/basique3d.js',
    '/sky/roadSky.js',
    '/camera/gltf.js',
    '/screen/screen.js',
    '/screen/debug.js',
    '/screen/blurOnePass.js',
    '/screen/bloom.js',
    '/screen/mergeBloom.js',
    '/screen/fxaa.js',
    '/screen/fxaa2.js',
  ],
  useDepthTexture: true,
  postprocess: {
    bloom: {
      intensity: 1,
    },
  },
  textures: {
    noisergb: 'LINEAR',
  },
  canvas: {
    width: 1024,
    height: 512,
  },
  mouse: {
    events: ['down', 'up', 'drag'],
  },
  camera: {
    position: { x: 0, y: 4, z: 0 },
    target: { x: 0, y: 0, z: 128 },
    near: 1,
    far: 200,
    angle: 90,
  },
  lampes: [
    {
      type: 0,
      position: { x: 0, y: 3, z: 3 },
      ambiant: [1, 1, 1],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 40,
      // direction: [0, 0, 1]
    },
  ],
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  // roadFrequence: [2, 0, 2],
  // roadAmplitude: [10, 0, 4],
  roadFrequence: [0, 0, 0],
  roadAmplitude: [0, 0, 0],
  roadLength: 128,
  roadWidth: 8,
  shipPosition: [0, 2, 3],
};
