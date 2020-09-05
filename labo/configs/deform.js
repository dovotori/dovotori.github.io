const MAIN_PROG = 'deform';
const MAIN_OBJ = 'sphere4';
export default {
  MAIN_PROG,
  MAIN_OBJ,
  shaders: [
    '/camera/basique3d.js',
    '/camera/frequencyCircle.js',
    '/camera/frequencyGrid.js',
    `/camera/${MAIN_PROG}.js`,
  ],
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
    ranges: {
      volume: { min: 0, max: 100, value: 50 },
      playbackRate: { min: 0, max: 100, value: 50 },
    },
  },
  postprocess: true,
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
