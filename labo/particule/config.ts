import type { LaboConfig } from "Labo/types";

const config: LaboConfig = {
  slug: "particule",
  shaders: [
    "/wgsl/fragment/f_particule.js",
    "/wgsl/vertex/v_particule.js",
    "/wgsl/postprocess.js",
    "/wgsl/gaussianBlur.js",
    "/wgsl/bright.js",
    "/wgsl/blend.js",
    "/wgsl/glitch.js",
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
  particules: {
    workgroupSize: 64, // 1 - 256 // depend on computer limitations
    workgroupCount: 1000,
    size: 2,
    speed: 10.0,
  },
  postprocess: {
    bright: {
      params: {
        threshold: [0.2],
        glowThresholdKnee: [0.3],
      },
      programName: "bright",
    },
    gaussianBlurHorizontal: {
      params: {
        direction: [1, 0],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
    gaussianBlurVertical: {
      params: {
        direction: [0, 1],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
    gaussianBlurHorizontal2: {
      params: {
        direction: [1, 0],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
    gaussianBlurVertical2: {
      params: {
        direction: [0, 1],
        radius: [4],
      },
      programName: "gaussianBlur",
    },
    blend: {
      programName: "blend",
    },
    glitch: {
      params: {
        speed: [0.7],
        delta: [0.004],
      },
      programName: "glitch",
    },
  },
};

export default config;
