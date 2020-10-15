const STAND = 'STAND';
const RUN = 'RUN';
const JUMP_DOWN = 'JUMP_DOWN';
const DIE = 'DIE';

export default {
  id: 'monster',
  x: 10,
  y: 4,
  z: 0.2,
  w: 0.5,
  h: 1,
  life: 100,
  physics: {
    run: 0.1,
    jump: 0,
    gravity: 0.05,
    damping: { x: 0, y: 0 },
    clamp: { x: 1, y: 1 },
  },
  states: {
    STAND,
    RUN,
    JUMP_DOWN,
    DIE,
  },
};
