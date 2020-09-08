import monster from '../persos/monster';

const { STAND, RUN, JUMP_DOWN, DIE } = monster.states;

export default {
  size: { w: 256, h: 512 },
  time: 100,
  refSize: 57,
  [STAND]: {
    uv: [
      {
        x: 28,
        y: 239,
        w: 26,
        h: 57,
        t: 1000,
      },
      {
        x: 0,
        y: 239,
        w: 28,
        h: 57,
        t: 1000,
      },
    ],
  },
  [RUN]: {
    uv: [
      {
        x: 39,
        y: 80,
        w: 40,
        h: 47,
      },
      {
        x: 106,
        y: 34,
        w: 40,
        h: 45,
      },
      {
        x: 0,
        y: 80,
        w: 39,
        h: 47,
      },
      {
        x: 79,
        y: 80,
        w: 39,
        h: 47,
      },
    ],
  },
  [JUMP_DOWN]: {
    uv: [
      {
        x: 173,
        y: 239,
        w: 33,
        h: 64,
      },
      {
        x: 206,
        y: 239,
        w: 34,
        h: 64,
      },
    ],
  },
  [DIE]: {
    uv: [
      {
        x: 50,
        y: 34,
        w: 56,
        h: 40,
      },
      {
        x: 0,
        y: 0,
        w: 84,
        h: 18,
      },
    ],
    iteration: 1,
  },
};
