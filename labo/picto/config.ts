import type { LaboConfig } from "../types";

const config: LaboConfig = {
  slug: "picto",
  assets: ["/img/signature3.avif"],
  mouse: { events: ["move"] },
  shaders: [
    "/screen/glitch.js",
    "/screen/wave.js",
    "/screen/rgb.js",
    "/screen/watercolorMoving.js",
    "/screen/screen.js",
  ],
  postprocess: {},
  useDepthTexture: false,
  canvas: {
    width: 512,
    height: 512,
  },
};

export default config;
