const GRASS_1 = 0;
const GRASS_2 = 1;
const GRASS_3 = 2;
const GRASS_4 = 3;
const GRASS_5 = 4;
const GRASS_6 = 5;
const GRASS_7 = 6;
const GRASS_8 = 7;
const TILE_1 = 8;
const TILE_2 = 9;
const TILE_3 = 10;
const TREE_1 = 11;
const TREE_2 = 12;
const TREE_3 = 13;
const TREE_4 = 14;
const TREE_5 = 15;
const TREE_6 = 16;
const TREE_7 = 17;
const TREE_8 = 18;
const TREE_9 = 19;
const TREE_10 = 20;
const TREE_11 = 21;
const TREE_12 = 22;

const CUBE = 0;
const FLAT = 1;

export default {
  size: { w: 256, h: 256 },
  refSize: 64,
  objTypes: {
    CUBE,
    FLAT,
  },
  colors: {
    '000': { pattern: TILE_1, objType: FLAT },
    150150150: { pattern: TILE_2, objType: FLAT },
    '00255': { pattern: TILE_2, objType: FLAT, z: -1 },
    25500: { pattern: TILE_2, objType: FLAT },
    '02500': { pattern: TILE_2, objType: FLAT },
    '02550': {
      pattern: TREE_1, objType: FLAT, scale: { x: 2, y: 2 }, z: -0.4,
    },
    '02000': { pattern: TREE_2, objType: FLAT, z: 1 },
    '01500': {
      pattern: TREE_3,
      objType: FLAT,
      scale: { x: 1.5, y: 1.5 },
      z: -0.5,
    },
    '01000': { pattern: TREE_4, objType: FLAT },
    // "255255255": { pattern: TREE_4, objType: FLAT }
  },
  [GRASS_1]: {
    uv: [{
      x: 161, y: 0, w: 52, h: 26,
    }],
  },
  [GRASS_2]: {
    uv: [{
      x: 109, y: 0, w: 52, h: 26,
    }],
  },
  [GRASS_3]: {
    uv: [{
      x: 0, y: 0, w: 57, h: 16,
    }],
  },
  [GRASS_4]: {
    uv: [{
      x: 45, y: 78, w: 52, h: 52,
    }],
  },
  [GRASS_5]: {
    uv: [{
      x: 0, y: 26, w: 57, h: 27,
    }],
  },
  [GRASS_6]: {
    uv: [{
      x: 57, y: 0, w: 52, h: 26,
    }],
  },
  [GRASS_7]: {
    uv: [{
      x: 166, y: 26, w: 52, h: 52,
    }],
  },
  [GRASS_8]: {
    uv: [{
      x: 0, y: 78, w: 45, h: 52,
    }],
  },
  [TILE_1]: {
    uv: [{
      x: 64, y: 188, w: 64, h: 64,
    }],
  },
  [TILE_2]: {
    uv: [{
      x: 128, y: 188, w: 64, h: 64,
    }],
  },
  [TILE_3]: {
    uv: [{
      x: 0, y: 188, w: 64, h: 64,
    }],
  },
  [TREE_1]: {
    uv: [{
      x: 82, y: 132, w: 40, h: 54,
    }],
  },
  [TREE_2]: {
    uv: [{
      x: 37, y: 132, w: 45, h: 54,
    }],
  },
  [TREE_3]: {
    uv: [{
      x: 122, y: 132, w: 44, h: 56,
    }],
  },
  [TREE_4]: {
    uv: [{
      x: 166, y: 132, w: 38, h: 56,
    }],
  },
  [TREE_5]: {
    uv: [{
      x: 0, y: 132, w: 37, h: 54,
    }],
  },
  [TREE_6]: {
    uv: [{
      x: 124, y: 26, w: 42, h: 51,
    }],
  },
  [TREE_7]: {
    uv: [{
      x: 97, y: 78, w: 28, h: 52,
    }],
  },
  [TREE_8]: {
    uv: [{
      x: 57, y: 26, w: 40, h: 50,
    }],
  },
  [TREE_9]: {
    uv: [{
      x: 169, y: 78, w: 14, h: 53,
    }],
  },
  [TREE_10]: {
    uv: [{
      x: 97, y: 26, w: 27, h: 50,
    }],
  },
  [TREE_11]: {
    uv: [{
      x: 183, y: 78, w: 37, h: 54,
    }],
  },
  [TREE_12]: {
    uv: [{
      x: 125, y: 78, w: 44, h: 53,
    }],
  },
};
