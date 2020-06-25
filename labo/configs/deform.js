const MAIN_PROG = 'deform';
const MAIN_OBJ = 'sphere4';
export default {
  MAIN_PROG,
  MAIN_OBJ,
  programs: ['basique3d', 'frequencyCircle', 'frequencyGrid', MAIN_PROG],
  assets: [`/obj/${MAIN_OBJ}.obj`, '/textures/earth.png', '/sound/akira.mp3'],
  camera: {
    position: { x: 0, y: 0, z: 20 },
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
      diffuse: [102 / 102, 255 / 255, 255 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      brillance: 1,
    },
    {
      type: 0,
      position: { x: -40, y: -40, z: 40 },
      ambiant: [1, 1, 1],
      diffuse: [255 / 255, 179 / 255, 255 / 255],
      specular: [255 / 255, 255 / 255, 255 / 255],
      brillance: 1,
    },
  ],
  mouse: { domId: 'deform', events: ['drag', 'wheel', 'click'] },
  controls: {
    fullscreen: { domId: 'deform', buttonId: 'fullscreen-toggle-btn' },
    volume: { domId: 'volume' },
    playbackRate: { domId: 'playbackRate' },
  },
  postprocess: {
    effects: [],
  },
  useDepthTexture: true,
  canvas: {
    width: 512,
    height: 512,
  },
};
