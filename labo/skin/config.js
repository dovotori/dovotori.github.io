const MAIN_PROG = "skin";
const MAIN_OBJ = "riggedPerso3";
export default {
  slug: "skin",
  MAIN_PROG,
  MAIN_OBJ,
  shaders: ["/camera/basique3d.js", `/camera/${MAIN_PROG}.js`],
  assets: [`/gltf/${MAIN_OBJ}.gltf`],
  camera: {
    position: { x: 0, y: 0, z: 40 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 40,
  },
  lampes: [
    {
      type: 0,
      position: { x: 10, y: 10, z: 0 },
      ambiant: [1, 1, 1],
      diffuse: [255 / 255, 255 / 255, 255 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      strength: 100,
    },
    {
      type: 0,
      position: { x: -10, y: -10, z: 0 },
      ambiant: [1, 1, 1],
      diffuse: [255 / 255, 255 / 255, 255 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      strength: 10,
    },
  ],
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
