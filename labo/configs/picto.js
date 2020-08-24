export default {
  assets: ['/img/signature.png'],
  mouse: { events: ['move'] },
  shaders: [
    '/screen/glitch.js',
    '/screen/wave.js',
    '/screen/rgb.js',
    '/screen/watercolorMoving.js',
  ],
  postprocess: true,
  useDepthTexture: false,
  canvas: {
    width: 512,
    height: 512,
  },
};
