const MAIN_PROG = 'paysage2';
const MAIN_OBJ = 'paysage2';
export default {
  slug: 'paysage',
  MAIN_PROG,
  MAIN_OBJ,
  shaders: [
    '/camera/basique3d.js',
    '/camera/color.js',
    `/camera/${MAIN_PROG}.js`,
    '/screen/fxaa.js',
    '/screen/screen.js',
  ],
  postprocess: true,
  useDepthTexture: true,
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
      position: { x: 14, y: 20, z: 14 },
      ambiant: [1, 0.8, 0.6],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 2000,
      ortho: { left: -20, right: 20, bottom: -10, top: 10 },
      near: 1,
      far: 40,
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
    domId: 'paysage',
    events: ['drag', 'wheel'],
  },
  canvas: {
    width: 1024,
    height: 1024,
  },
};
