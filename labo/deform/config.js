const MAIN_PROG = "deform";
export default {
  slug: "deform",
  MAIN_PROG,
  shaders: [
    "/camera/normale.js",
    "/camera/frequencyCircle.js",
    "/camera/frequencyGrid.js",
    `/camera/${MAIN_PROG}.js`,
  ],
  assets: ["/textures/earth.png", "/sound/akira.mp3"],
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
  mouse: { domId: "deform", events: ["drag", "wheel", "click"] },
  controls: {
    fullscreen: { domId: "deform", buttonId: "fullscreen-toggle-btn" },
    ranges: {
      volume: { min: 0, max: 100, value: 50, label: "Volume" },
      playbackRate: { min: 0, max: 100, value: 50, label: "Playback rate" },
    },
  },
  postprocess: true,
  useDepthTexture: true,
  canvas: {
    width: 1024,
    height: 1024,
  },
};
