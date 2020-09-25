import ManagerTextures from '../managers/ManagerTextures';
import ManagerObjets from '../managers/ManagerObjets';
import ManagerPrograms from '../managers/ManagerPrograms';
import ManagerGltfs from '../managers/ManagerGltfs';
import ManagerSounds from '../managers/ManagerSounds';
import PostProcess from '../postprocess/PostProcess';
import Bloom from '../postprocess/Bloom';

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

    if (assets) {
      if (assets.shaders) {
        this.mngProg = new ManagerPrograms(this.gl, assets.shaders, config.canvas);

        if (config.postprocess) {
          this.postProcess = new PostProcess(
            this.gl,
            width,
            height,
            this.canUseDepth(),
            this.mngProg.getAll()
          );

          if (config.postprocess.bloom) {
            this.bloom = new Bloom(
              this.gl,
              width,
              height,
              this.canUseDepth(),
              this.mngProg.getAll(),
              config.postprocess.bloom
            );
          }
        }
      }

      if (assets.textures) {
        this.mngTex = new ManagerTextures(this.gl, assets.textures, config.textures);
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
    this.resizeViewport();
  }

  canUseDepth() {
    return this.config.useDepthTexture && this.config.support.depthTexture;
  }

  resize(box) {
    this.containerSize = box;
    this.resizeViewport();
  }

  update(time) {
    this.time = time;
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  resizeViewport() {
    this.gl.viewport(0, 0, this.containerSize.width, this.containerSize.height);
  }

  getColorPixel(x, y) {
    const pixel = new Uint8Array(4);
    this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel);
    return pixel;
  }
}
