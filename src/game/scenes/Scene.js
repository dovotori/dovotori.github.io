import {
  ManagerTextures,
  ManagerObjets,
  ManagerPrograms,
  ManagerGltfs,
} from "../managers";
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

    if (this.config.postprocess) {
      this.postProcess = new PostProcess(
        this.gl,
        this.config.postprocess.effects,
        width,
        height,
        this.config.postprocess.useDepth
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
