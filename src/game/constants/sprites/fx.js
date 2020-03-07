import fx from '../persos/fx';

const { DUST } = fx.states;

export default {
  size: { w: 32, h: 64 },
  time: 200,
  refSize: 57,
  [DUST]: {
    uv: [
      {
        x: 0, y: 0, w: 26, h: 19,
      },
      {
        x: 0, y: 19, w: 26, h: 14,
      },
      {
        x: 0, y: 33, w: 29, h: 12,
      },
    ],
    iteration: 1,
  },
};
