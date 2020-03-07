import bullet from '../persos/bullet';

const { BULLET, BULLET_LOAD } = bullet.states;

export default {
  size: { w: 64, h: 256 },
  time: 100,
  refSize: 57,
  [BULLET]: {
    uv: [{
      x: 0, y: 0, w: 35, h: 17,
    }, {
      x: 0, y: 17, w: 49, h: 32,
    }],
  },
  [BULLET_LOAD]: {
    uv: [
      {
        x: 0, y: 49, w: 54, h: 54, px: 0, py: 27,
      },
      {
        x: 0, y: 103, w: 38, h: 39, px: 0, py: 19,
      },
    ],
  },
};
