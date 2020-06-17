export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const SPACE = "SPACE";
export const SHIFT = "SHIFT";
export const X = "X";
export const W = "W";
export const ENTER = "ENTER";
export const ECHAP = "ECHAP";

export default {
  assets: [
    "/textures/heros.png",
    "/textures/fx.png",
    "/textures/bullet.png",
    "/textures/level1.png",
    "/textures/rocks.png",
    "/textures/ground.png",
    "/textures/clouds.png",
    "/obj/tile.obj",
    "/obj/cube.obj",
    "/obj/cubeTile.obj",
    "/levels/level3.bmp",
  ],
  programs: ["color", "sprite", "spritePhong", "albedoPhong", "background"],
  camera: {
    position: { x: 10, y: 10, z: 22 },
    target: { x: 10, y: 10, z: 0 },
    near: 1,
    far: 1000,
    angle: 40,
  },
  lampes: [
    {
      type: 0,
      position: { x: 0, y: 0, z: 0 },
      ambiant: [1, 1, 1],
      diffuse: [1, 0.9, 0.9],
      specular: [0, 0, 0],
      strength: 1,
      brillance: 200,
    },
  ],
  tilemap: {
    tileSize: {
      w: 1,
      h: 1,
    },
    viewBox: {
      w: 20,
      h: 10,
    },
  },
  keyboard: {
    38: UP,
    40: DOWN,
    37: LEFT,
    39: RIGHT,
    32: SPACE,
    16: SHIFT,
    88: X,
    87: W,
    13: ENTER,
    27: ECHAP,
  },
  postprocess: {
    effects: [
      "fxaa",
      "rgb",
      "wave",
      "watercolor",
      "pixel",
      "glitch4",
      "sepia",
      "sketch",
      "oil",
    ],
  },
  useDepthTexture: false,
  splashscreen: false,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
