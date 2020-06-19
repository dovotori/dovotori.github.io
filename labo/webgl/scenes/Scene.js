import ManagerTextures from "../managers/ManagerTextures";
import ManagerObjets from "../managers/ManagerObjets";
import ManagerPrograms from "../managers/ManagerPrograms";
import ManagerGltfs from "../managers/ManagerGltfs";
import ManagerSounds from "../managers/ManagerSounds";
import PostProcess from "../gl/PostProcess";

export default class {
  constructor(gl, config, assets) {
    this.gl = gl;
    this.config = config;
    this.time = 0;
    const { width, height } = this.config.canvas;
    this.containerSize = {
      width,
      height,
    };
    if (config.programs) {
      this.mngProg = new ManagerPrograms(this.gl, config.programs);
    }

    if (config.postprocess) {
      const { effects } = config.postprocess;
      this.postProcess = new PostProcess(
        this.gl,
        width,
        height,
        this.canUseDepth(),
        effects
      );
    }

    if (assets.textures) {
      this.mngTex = new ManagerTextures(this.gl, assets.textures);
    }

    if (assets.objets) {
      this.mngObj = new ManagerObjets(this.gl, assets.objets, assets.materials);
    }

    if (assets.gltfs) {
      this.mngGltf = new ManagerGltfs(this.gl, assets.gltfs);
    }

    if (assets.sounds) {
      this.mngSound = new ManagerSounds(assets.sounds);
    }
  }

  canUseDepth() {
    return this.config.useDepthTexture && this.config.support.depthTexture;
  }

  resize(box) {
    this.containerSize = box;

    this.gl.viewport(0, 0, this.containerSize.width, this.containerSize.height);
  }

  update() {
    this.time += 1;
  }

  render() {
    this.update();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  getColorPixel(x, y) {
    const pixel = new Uint8Array(4);
    this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel);
    return pixel;
  }
}
