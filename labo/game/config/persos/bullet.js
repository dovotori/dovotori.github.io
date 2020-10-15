const BULLET = 'BULLET';
const BULLET_LOAD = 'BULLET_LOAD';

export default {
  id: 'bullet',
  x: 0,
  y: 0,
  z: 0.4,
  w: 0.5,
  h: 0.5,
  damage: 10,
  physics: {
    speed: 0.5,
    recoil: 0.1,
  },
  states: {
    BULLET_LOAD,
    BULLET,
  },
};
