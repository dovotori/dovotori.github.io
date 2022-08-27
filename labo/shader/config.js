export default {
  slug: 'shader',
  shaders: [
    '/camera/road.js',
    '/screen/line.js',
    '/screen/point.js',
    '/particules/pass1Morph.js',
    '/particules/pass2Camera.js',
    '/camera/basique3d.js',
    '/screen/landscape.js',
    '/screen/blurOnePass.js',
    '/screen/screen.js',
    '/screen/debug.js',
    '/screen/bloom.js',
  ],
  postprocess: {
    bloom: true,
  },
  canvas: {
    width: 1024,
    height: 1024,
  },
  mouse: {
    events: ['drag', 'down', 'move'],
  },
  camera: {
    position: { x: 0, y: 0, z: -4 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 200,
    angle: 90,
  },
  controls: {
    modes: [1, 2, 3],
    fullscreen: { buttonId: 'fullscreen-toggle-btn' },
  },
};
