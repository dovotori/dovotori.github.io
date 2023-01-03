const MAIN_PROG = "paysage";
const MAIN_OBJ = "paysage";
export default {
  slug: "paysage",
  MAIN_PROG,
  MAIN_OBJ,
  shaders: [
    "/camera/basique3d.js",
    "/camera/color.js",
    `/camera/${MAIN_PROG}.js`,
    "/screen/fxaa.js",
    "/screen/fxaa2.js",
    "/screen/screen.js",
    "/camera/buffers.js",
    "/screen/brightcontrast.js",
    "/screen/ssao.js",
    "/screen/blurOnePass.js",
    "/screen/compose.js",
    "/screen/bloom.js",
    "/camera/shadow.js",
  ],
  postprocess: {
    ssao: {
      // radius: 2.0,
      // strength: 0.5,
      radius: 2.0,
      strength: 1.0,
      blur: {
        size: 0.000001,
        intensity: 0.6,
      },
    },
    shadow: {
      epsilon: 0.0001,
      lighten: 0.1, // entre 0.0 et 0.5 ajoute à la couleur de l'ombre
      blur: {
        size: 0.1,
        intensity: 1.0,
      },
    },
  },
  useDepthTexture: true,
  assets: [`/gltf/${MAIN_OBJ}.gltf`],
  camera: {
    position: { x: -14, y: 8, z: 14 },
    target: { x: 0, y: -2, z: 0 },
    near: 1,
    far: 40,
    angle: 90,
    // ortho: { left: -20, right: 20, bottom: -10, top: 10 },
  },
  lampes: [
    {
      type: 0,
      position: { x: 10, y: 20, z: 10 },
      ambiant: [1, 0.8, 0.6],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 2000,
      ortho: { left: -17, right: 17, bottom: -15, top: 15 },
      near: 10,
      far: 50,
      // direction: [0, 0, 1]
    },
    {
      type: 0,
      position: { x: -14, y: 20, z: -14 },
      ambiant: [0.8, 0.6, 1],
      diffuse: [0.6, 0.5, 0.8],
      specular: [0.8, 0.7, 1],
      brillance: 10,
      radius: 10,
      direction: [0, 0, 1],
      strength: 2000,
    },
  ],
  mouse: {
    events: ["drag", "wheel"],
  },
  canvas: {
    width: 1024,
    height: 1024,
  },
  controls: {
    fullscreen: { buttonId: "fullscreen-toggle-btn" },
  },
};
