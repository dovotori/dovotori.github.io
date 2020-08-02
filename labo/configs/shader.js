export default {
  programs: ['line', 'grid', 'pass1Morph', 'pass2Camera', 'basique3d'],
  canvas: {
    width: 512,
    height: 512,
  },
  mouse: {
    domId: 'mouse',
    events: ['drag', 'down', 'move'],
  },
  camera: {
    position: { x: 0, y: 0, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 100,
    angle: 40,
  },
  controls: {
    modes: [1, 2, 3],
  },
};
