import { UP, DOWN, LEFT, RIGHT } from '../lib/webgl/constants/keyboard';

export default {
  slug: 'diorama',
  shaders: [
    '/diorama/terrain.js',
    '/diorama/water.js',
    '/diorama/instancing.js',
    '/diorama/instancingDepth.js',
    '/diorama/shadow.js',
    '/diorama/terrainDepth.js',
    '/screen/screen.js',
    '/screen/blurOnePass.js',
    '/screen/brightcontrast.js',
    '/screen/composeShadow.js',
    '/camera/gltf.js',
    '/camera/basique3d.js',
  ],
  assets: ['/gltf/three.gltf', '/gltf/antenna.gltf', '/textures/waterN.jpg', '/textures/dudv.png'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  postprocess: {
    shadow: {
      epsilon: 0.01,
      lighten: 0.1,
      blur: {
        size: 0.1,
        intensity: 1.0,
      },
    },
  },
  useDepthTexture: true,
  useDrawBuffer: true,
  camera: {
    position: { x: 2, y: 2, z: 2 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  lampes: [
    {
      type: 0,
      position: { x: 2, y: 4, z: 2 },
      ambiant: [1, 1, 1],
      diffuse: [1, 1, 1],
      specular: [1, 1, 1],
      brillance: 1,
      strength: 1.2,
      near: 1,
      far: 10,
      ortho: { left: -1.5, right: 1.5, bottom: -1.5, top: 1.5 },
    },
  ],
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  terrain: {
    width: 200,
    height: 100,
    lacunarity: 1.6,
    persistance: 0.5,
    waterLevel: 0.4,
    colors: [
      // DIRT
      '#251a16',
      '#6e6254',
      '#8b6a47',
      // ROC
      '#5d564c',
      // '#978d72',
      '#989b56',
      // GREEN
      '#6d753a',
      '#89934c',
      '#8b8f54',
      '#ffffff',
    ],
  },
  fog: {
    color: [0.0, 0.0, 0.0, 0.0],
    start: 2,
    end: 10,
  },
  mouse: {
    events: ['drag', 'click'],
  },
  keyboard: {
    UP,
    DOWN,
    LEFT,
    RIGHT,
  },
};
