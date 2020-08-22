export default {
  programs: ['road3', 'basique3d', 'skyWithFloor', 'gltf'],
  assets: [`/gltf/raceship.gltf`],
  canvas: {
    width: 512,
    height: 512,
  },
  mouse: {
    domId: 'mouse',
    events: ['drag', 'down', 'move', 'up'],
  },
  camera: {
    position: { x: 0, y: 1.2, z: 0 },
    target: { x: 0, y: 0, z: 128 },
    near: 1,
    far: 200,
    angle: 90,
  },
  controls: {
    fullscreen: { domId: 'race', buttonId: 'fullscreen-toggle-btn' },
  },
  roadFrequence: [2, 0, 2],
  roadAmplitude: [10, 0, 4],
  roadLength: 128,
  roadWidth: 2,
};
