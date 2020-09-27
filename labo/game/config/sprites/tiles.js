const DOOR1 = 0;
const GRASS1 = 1;
const GRASS2 = 2;
const GRASS3 = 3;
const GRASS4 = 4;
const GRASS5 = 5;
const GRASS6 = 6;
const GRASS7 = 7;
const GRASS8 = 8;
const TILE1 = 9;
const TILE2 = 10;
const TILE3 = 11;
const TREE1 = 12;
const TREE2 = 13;
const TREE3 = 14;
const TREE4 = 15;
const TREE5 = 16;
const TREE6 = 17;
const TREE7 = 18;
const TREE8 = 19;
const TREE9 = 20;
const TREE10 = 21;
const TREE11 = 22;
const TREE12 = 23;

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
    '000': { pattern: TILE1, objType: FLAT },
    150150150: { pattern: TILE2, objType: FLAT },
    '00255': { pattern: TILE2, objType: FLAT, z: -1 },
    25500: { pattern: TILE2, objType: FLAT },
    '02500': { pattern: TILE2, objType: FLAT },
    '02550': {
      pattern: TREE1,
      objType: FLAT,
      scale: { x: 2, y: 2 },
      z: -0.4,
    },
    '02000': { pattern: TREE2, objType: FLAT, z: 1 },
    '01500': {
      pattern: TREE3,
      objType: FLAT,
      scale: { x: 1.5, y: 1.5 },
      z: -0.5,
    },
    '01000': { pattern: TREE4, objType: FLAT },
    10000: { pattern: DOOR1, scale: { x: 4, y: 4 }, objType: FLAT },
  },
  [DOOR1]: { uv: [{ x: 166, y: 26, w: 52, h: 52 }] },
  [GRASS1]: { uv: [{ x: 57, y: 0, w: 52, h: 26 }] },
  [GRASS2]: { uv: [{ x: 109, y: 0, w: 52, h: 26 }] },
  [GRASS3]: { uv: [{ x: 0, y: 0, w: 57, h: 16 }] },
  [GRASS4]: { uv: [{ x: 0, y: 78, w: 52, h: 52 }] },
  [GRASS5]: { uv: [{ x: 0, y: 26, w: 57, h: 27 }] },
  [GRASS6]: { uv: [{ x: 161, y: 0, w: 52, h: 26 }] },
  [GRASS7]: { uv: [{ x: 52, y: 78, w: 52, h: 52 }] },
  [GRASS8]: { uv: [{ x: 104, y: 78, w: 45, h: 52 }] },
  [TILE1]: { uv: [{ x: 38, y: 187, w: 64, h: 64 }] },
  [TILE2]: { uv: [{ x: 102, y: 187, w: 64, h: 64 }] },
  [TILE3]: { uv: [{ x: 166, y: 187, w: 64, h: 64 }] },
  [TREE1]: { uv: [{ x: 14, y: 131, w: 40, h: 54 }] },
  [TREE2]: { uv: [{ x: 91, y: 131, w: 45, h: 54 }] },
  [TREE3]: { uv: [{ x: 173, y: 131, w: 44, h: 56 }] },
  [TREE4]: { uv: [{ x: 0, y: 187, w: 38, h: 56 }] },
  [TREE5]: { uv: [{ x: 136, y: 131, w: 37, h: 54 }] },
  [TREE6]: { uv: [{ x: 124, y: 26, w: 42, h: 51 }] },
  [TREE7]: { uv: [{ x: 149, y: 78, w: 28, h: 52 }] },
  [TREE8]: { uv: [{ x: 84, y: 26, w: 40, h: 50 }] },
  [TREE9]: { uv: [{ x: 0, y: 131, w: 14, h: 53 }] },
  [TREE10]: { uv: [{ x: 57, y: 26, w: 27, h: 50 }] },
  [TREE11]: { uv: [{ x: 54, y: 131, w: 37, h: 54 }] },
  [TREE12]: { uv: [{ x: 177, y: 78, w: 44, h: 53 }] },
};
