export const UP = 'UP';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const SPACE = 'SPACE';
export const SHIFT = 'SHIFT';
export const X = 'X';
export const W = 'W';
export const ENTER = 'ENTER';
export const ECHAP = 'ECHAP';

const STAND = 'STAND';
const RUN = 'RUN';
const JUMP_UP = 'JUMP_UP';
const JUMP_DOWN = 'JUMP_DOWN';
const DASH = 'DASH';
const AIM = 'AIM';
const RUN_JUMP_UP = 'RUN_JUMP_UP';
const RUN_JUMP_DOWN = 'RUN_JUMP_DOWN';
const DIE = 'DIE';
const SLASH = 'SLASH';
const SLASH_2 = 'SLASH_2';
const SLASH_3 = 'SLASH_3';
const SLOW_DOWN = 'SLOW_DOWN';
const JUMP_LOAD = 'JUMP_LOAD';
const WALL = 'WALL';
const WALL_UP = 'WALL_UP';
const LAND = 'LAND';

export default {
  id: 'heros',
  x: 4,
  y: 5,
  z: 0.1,
  w: 0.5,
  h: 1,
  physics: {
    run: 0.1,
    jump: 0.6,
    aircontrol: 0.05,
    dash: 2,
    gravity: 0.05,
    damping: { x: 0.8, y: 0.8 }, // ralentissement
    clamp: { x: 0.4, y: 0.5 }, // speed limitation
  },
  states: {
    STAND,
    RUN,
    JUMP_UP,
    JUMP_DOWN,
    DASH,
    AIM,
    RUN_JUMP_UP,
    RUN_JUMP_DOWN,
    DIE,
    SLASH,
    SLASH_2,
    SLASH_3,
    SLOW_DOWN,
    JUMP_LOAD,
    WALL,
    WALL_UP,
    LAND,
  },
  lockStates: [AIM, SLASH, DASH, JUMP_LOAD],
  keys: {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    SPACE,
    SHIFT,
    X,
    W,
  },
  combos: {
    attack: [
      {
        key: X, cancel: false, threshold: 1000, sprite: 'up',
      },
      {
        key: X, cancel: false, threshold: 1000, sprite: 'down',
      },
      { key: X, cancel: false, sprite: 'run' },
    ],
  },
};
