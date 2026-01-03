import type { LaboConfig } from "Labo/types";

const config: LaboConfig = {
  slug: "particule",
  shaders: ["/wgsl/fragment/f_particule.js", "/wgsl/vertex/v_particule.js"],
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
};

export default config;
