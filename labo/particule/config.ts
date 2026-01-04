import type { LaboConfig } from "Labo/types";

const config: LaboConfig = {
  slug: "particule",
  shaders: [
    "/wgsl/fragment/f_particule.js",
    "/wgsl/vertex/v_particule.js",
    "/wgsl/postprocess.js",
    "/wgsl/gaussianBlur.js",
  ],
  canvas: {
    width: 1024,
    height: 1024,
  },
  useWebGpu: true,
  controls: {
    fullscreen: { buttonId: "fullscreen-toggle-btn" },
  },
  mouse: {
    events: ["move", "click"],
  },
  postprocess: {
    guassianBlurHorizontal: {
      params: {
        direction: [1, 0],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
    guassianBlurVertical: {
      params: {
        direction: [0, 1],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
  },
};

export default config;
