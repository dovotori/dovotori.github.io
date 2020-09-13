const MAIN_PROG = 'skinMat';
const MAIN_OBJ = 'hajime';
export default {
  slug: 'skin',
  MAIN_PROG,
  MAIN_OBJ,
  shaders: ['/camera/basique3d.js', `/camera/${MAIN_PROG}.js`],
  assets: [`/gltf/${MAIN_OBJ}.gltf`],
  camera: {
    position: { x: 0, y: 0, z: 100 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
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
    },
    {
      type: 0,
      position: { x: -40, y: -40, z: 40 },
      ambiant: [1, 1, 1],
      diffuse: [255 / 255, 179 / 255, 102 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      brillance: 1,
    },
  ],
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
