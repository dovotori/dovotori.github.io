const MAIN_PROG = 'grid';
const MAIN_OBJ = '';

export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: [MAIN_PROG, 'pass1Morph', 'pass2Camera'],
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
};
