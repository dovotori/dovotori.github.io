const MAIN_PROG = "signature";
const MAIN_OBJ = "head";
export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: ["basique3d", MAIN_PROG],
  assets: [`/gltf/${MAIN_OBJ}.gltf`],
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
