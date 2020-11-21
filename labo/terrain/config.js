import { UP, DOWN, LEFT, RIGHT } from '../lib/webgl/constants/keyboard';

export default {
  slug: 'terrain',
  shaders: [
    '/camera/terrain.js',
    '/camera/terrainWater.js',
    '/camera/instancing.js',
    // shadow
    '/screen/screen.js',
    '/screen/blurOnePass.js',
    '/camera/buffers.js',
    '/camera/shadow.js',
    '/screen/brightcontrast.js',
  ],
  assets: ['/gltf/three.gltf'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  postprocess: {
    shadow: {
      epsilon: 0.0001,
      lighten: 0.1,
      blur: {
        size: 0.1,
        intensity: 1.0,
      },
    },
  },
  useDepthTexture: true,
  camera: {
    position: { x: 4, y: 4, z: 4 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  lampes: [
    {
      type: 0,
      position: { x: 4, y: 4, z: 4 },
      ambiant: [1, 0.8, 0.6],
      diffuse: [0.8, 0.6, 0.5],
      specular: [1, 0.8, 0.7],
      brillance: 1,
      strength: 2000,
      near: 1,
      far: 50,
      ortho: { left: -4, right: 4, bottom: -4, top: 4 },
    },
  ],
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  terrain: {
    width: 100,
    height: 100,
    lacunarity: 1.6,
    persistance: 0.5,
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
    // [
    //   // MARRONS DARK TO LIGHT
    //   '#675553',
    //   '#89776b',
    //   '#c8baad',
    //   // // LIGHT GREEN
    //   '#c1baa8',
    //   '#d1cfb8',
    //   // SHADOW BLUE
    //   '#86999d',
    //   '#a3b3c0',
    //   '#dde3e1',
    // ]
  },
  fog: {
    color: [0.0, 0.0, 0.2, 0.0],
    start: 2.0,
    end: 4.0,
  },
  keyboard: {
    UP,
    DOWN,
    LEFT,
    RIGHT,
  },
};
