import type { LaboConfig } from "Labo/types";

const config: LaboConfig = {
  slug: "particule3d",
  shaders: [
    "/wgsl/fragment/f_particule_3d.js",
    "/wgsl/vertex/v_particule_3d.js",
    "/wgsl/skybox.js",
    "/wgsl/postprocess.js",
    "/wgsl/gaussianBlur.js",
    "/wgsl/bright.js",
  ],
  assets: [
    "/gltf/suzanne.glb",
    "/gltf/smoothSphere.glb",
    "/gltf/cube.glb",
    "/textures/pos-x.webp",
    "/textures/neg-x.webp",
    "/textures/pos-y.webp",
    "/textures/neg-y.webp",
    "/textures/pos-z.webp",
    "/textures/neg-z.webp",
  ],
  canvas: {
    width: 1024,
    height: 1024,
  },
  useWebGpu: true,
  controls: {
    fullscreen: { buttonId: "fullscreen-toggle-btn" },
  },
  camera: {
    // perspective
    position: { x: 0, y: 0, z: 1500 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 4000,
    angle: 60,
  },
  particules: {
    workgroupSize: 1, // 1 - 256 // depend on computer limitations
    workgroupCount: 10,
    size: 200,
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
