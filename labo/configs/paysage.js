const MAIN_PROG = 'paysage2';
const MAIN_OBJ = 'paysage';
export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: ['basique3d', 'color', MAIN_PROG],
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
    position: { x: -2, y: 1, z: 2 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 40,
    angle: 90,
  },
  lampes: [
    {
      type: 0,
      position: { x: 4, y: 4, z: 4 },
      ambiant: [1, 0.8, 0.6],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 2,
      // direction: [0, 0, 1]
    },
    {
      type: 0,
      position: { x: -4, y: 4, z: 4 },
      ambiant: [0.8, 0.6, 1],
      diffuse: [0.6, 0.5, 0.8],
      specular: [0.8, 0.7, 1],
      brillance: 100,
      radius: 10,
      direction: [0, 0, 1],
      strength: 2,
    },
  ],
  mouse: {
    domId: 'paysage',
    events: ['drag', 'wheel'],
  },
  postprocess: {
    effects: ['fxaa'],
  },
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
