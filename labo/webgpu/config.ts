import type { LaboConfig } from "../types";

const config: LaboConfig = {
  slug: "webgpu",
  shaders: [
    "/wgsl/vertex/v_gltf.js",
    "/wgsl/fragment/f_gltf.js",
    "/wgsl/vertex/v_picking.js",
    "/wgsl/fragment/f_picking.js",
    "/wgsl/vertex/v_debug_tex.js",
    "/wgsl/vertex/v_shadow_depth.js",
    "/wgsl/fragment/f_debug_tex.js",
    "/wgsl/vertex/v_model_camera.js",
    "/wgsl/fragment/f_simple.js",
  ],
  // assets: ['/gltf/paysage.gltf'],
  // assets: ['/gltf/distributedInstances.gltf'],
  assets: ["/gltf/paysage.glb"],
  // assets: ["/gltf/plane.gltf"],
  // assets: ["/gltf/head.gltf"],
  // assets: ['/gltf/headinterleaved.gltf'],
  canvas: {
    width: 1024,
    height: 1024,
  },
  camera: {
    // perspective
    position: { x: 0, y: 4, z: 30 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 60,
    angle: 60,
  },
  // camera: {
  //   // ortho
  //   position: { x: 0, y: 4, z: 20 },
  //   target: { x: 0, y: 0, z: 0 },
  //   near: 1,
  //   far: 100,
  //   ortho: { left: -20, right: 20, bottom: -20, top: 20 },
  // },
  lampes: [
    {
      type: 0,
      position: { x: -20, y: 20, z: -2 },
      target: { x: 0, y: 0, z: 0 },
      ambiant: [1, 1, 0.4],
      diffuse: [1, 1, 1],
      specular: [1, 1, 1],
      strength: 2,
      brillance: 1,
      near: 1,
      far: 40,
      ortho: { left: -15, right: 15, bottom: -15, top: 15 },
    },
    {
      type: 0,
      position: { x: -10, y: 20, z: 10 },
      ambiant: [1, 0.6, 0.8],
      strength: 1,
    },
  ],
  controls: {
    fullscreen: { buttonId: "fullscreen-toggle-btn" },
  },
  useWebGpu: true,
  mouse: {
    events: ["click"],
  },
};
export default config;
