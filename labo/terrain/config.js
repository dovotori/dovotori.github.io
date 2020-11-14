import { UP, DOWN, LEFT, RIGHT } from '../lib/webgl/constants/keyboard';

export default {
  slug: 'terrain',
  shaders: ['/camera/terrain.js', '/camera/instancing.js'],
  assets: [`/gltf/three.gltf`],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    position: { x: -2, y: 4, z: 5 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 60,
  },
  controls: {
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
  terrain: {
    width: 100,
    height: 100,
    lacunarity: 2,
    persistance: 0.5,
  },
  fog: {
    color: [0.0, 0.0, 0.2, 0.0],
    start: 2.0,
    end: 7.0,
  },
  keyboard: {
    UP,
    DOWN,
    LEFT,
    RIGHT,
  },
};
