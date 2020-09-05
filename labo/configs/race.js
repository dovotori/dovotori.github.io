export default {
  assets: ['/textures/noisergb.png', '/gltf/raceship.gltf'],
  shaders: [
    '/camera/road3.js',
    '/camera/gltf.js',
    '/camera/roadmountain.js',
    '/camera/basique3d.js',
    '/sky/roadSky.js',
    '/camera/gltf.js',
    '/screen/screen.js',
    '/screen/debug.js',
    '/screen/blurBloomOnePass.js',
    '/screen/bloom.js',
    '/screen/fxaa.js',
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
    domId: 'mouse',
    events: ['drag', 'down', 'move', 'up'],
  },
  camera: {
    position: { x: 0, y: 1.3, z: 0 },
    target: { x: 0, y: 0, z: 128 },
    near: 1,
    far: 200,
    angle: 90,
  },
  lampes: [
    {
      type: 0,
      position: { x: 0, y: 3, z: 3 },
      ambiant: [1, 0.8, 0.6],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 4,
      // direction: [0, 0, 1]
    },
  ],
  controls: {
    fullscreen: { domId: 'race', buttonId: 'fullscreen-toggle-btn' },
  },
  roadFrequence: [2, 0, 2],
  roadAmplitude: [10, 0, 4],
  roadLength: 128,
  roadWidth: 4,
};
