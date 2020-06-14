export default {
  assets: ["/img/signature.png"],
  mouse: { events: ["move"] },
  postprocess: {
    effects: ["glitch", "wave", "rgb", "watercolorMoving"],
    useDepth: false,
  },
  canvas: {
    width: 512,
    height: 512,
  },
};
