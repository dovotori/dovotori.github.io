const MAIN_PROG = "signature";
const MAIN_OBJ = "head";
export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: ["basique3d", "bone", MAIN_PROG],
  assets: [`/gltf/${MAIN_OBJ}.gltf`],
  positions: {
    plot: [
      { x: -0.74175, z: -0.889829, y: 0.03561 },
      { x: -0.57378, z: -0.91103, y: 0.03561 },
      { x: -0.363515, z: -0.8868, y: 0.03561 },
    ],
    road: [{ x: 0, y: -0.2, z: 0 }],
    electric: [{ x: -0.5, y: 0, z: -0.4 }],
    mailbox: [{ x: -0.2, y: 0, z: -0.4 }],
    bench: [{ x: -0.2, y: 0, z: -0.4 }],
    panel: [{ x: 0, y: 0, z: 0 }],
  },
  camera: {
    position: { x: 0, y: 0, z: 30 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 40,
    angle: 40,
  },
  lampes: [
    {
      type: 0,
      position: { x: 40, y: 40, z: 40 },
      ambiant: [1, 1, 1],
      diffuse: [102 / 255, 255 / 255, 204 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      brillance: 1,
      // direction: [0, 0, 1]
    },
    {
      type: 0,
      position: { x: -40, y: -40, z: 40 },
      ambiant: [1, 1, 1],
      diffuse: [255 / 255, 179 / 255, 102 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      brillance: 1,
      // direction: [0, 0, 1]
    },
    // {
    //   type: 0,
    //   position: { x: -40, y: 40, z: 40 },
    //   ambiant: [0.6, 0.6, 1],
    //   diffuse: [0.5, 0.5, 0.8],
    //   specular: [0.7, 0.7, 1],
    //   brillance: 100,
    //   radius: 10,
    //   direction: [0, 0, 1]
    // }
  ],
  mouse: { domId: "signature", events: ["move"] },
  postprocess: {
    effects: ["glitch", "wave", "watercolorMoving", "fxaa"],
  },
  useDepthTexture: true,
  canvas: {
    width: 512,
    height: 512,
  },
};
