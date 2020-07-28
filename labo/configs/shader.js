const MAIN_PROG = 'line';
const MAIN_OBJ = '';

export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: [MAIN_PROG],
  canvas: {
    width: 512,
    height: 512,
  },
  mouse: {
    domId: 'mouse',
    events: ['drag', 'down', 'move'],
  },
};
