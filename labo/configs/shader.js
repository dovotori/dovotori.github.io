export default {
  programs: ['road3', 'line', 'point', 'pass1Morph', 'pass2Camera', 'basique3d', 'landscape'],
  canvas: {
    width: 512,
    height: 512,
  },
  mouse: {
    domId: 'mouse',
    events: ['drag', 'down', 'move'],
  },
  camera: {
    position: { x: 0, y: 0, z: -4 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 90,
  },
  controls: {
    modes: [1, 2, 3],
    fullscreen: { domId: 'shader', buttonId: 'fullscreen-toggle-btn' },
  },
};
