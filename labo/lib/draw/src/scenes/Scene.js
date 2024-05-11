import ManagerTextures from '../managers/ManagerTextures'
import ManagerObjets from '../managers/ManagerObjets'
import ManagerPrograms from '../managers/ManagerPrograms'
import ManagerGltfs from '../managers/ManagerGltfs'
import ManagerSounds from '../managers/ManagerSounds'
import PostProcess from '../postprocess/PostProcess'
import Bloom from '../postprocess/Bloom'
import Ssao from '../postprocess/Ssao'
import Shadow from '../postprocess/Shadow'

export default class {
  constructor(gl, config) {
    this.gl = gl
    this.config = config
    this.time = 0
    const { width, height } = this.config.canvas
    this.containerSize = {
      width,
      height,
    }
  }

  async setupAssets(assets) {
    const { config, gl } = this
    const { width, height } = config.canvas
    if (assets?.shaders) {
      this.mngProg = new ManagerPrograms()
      await this.mngProg.setup(gl, assets.shaders, config.canvas)

      if (config.postprocess) {
        const useDepth = this.canUseDepth()
        const processConfig = { width, height, useDepth }
        const programs = this.mngProg.getAll()

        this.postProcess = new PostProcess(gl, processConfig, programs)

        if (config.postprocess.bloom) {
          this.bloom = new Bloom(gl, { ...processConfig, ...config.postprocess.bloom }, programs)
        }

        if (config.postprocess.ssao) {
          this.ssao = new Ssao(
            gl,
            {
              ...processConfig,
              ...config.postprocess.ssao,
              near: config.camera.near,
              far: config.camera.far,
            },
            programs,
          )
        }

        if (config.postprocess.shadow) {
          this.shadow = new Shadow(
            gl,
            {
              ...processConfig,
              ...config.postprocess.shadow,
            },
            programs,
          )
        }
      }
    }

    if (assets?.textures) {
      this.mngTex = new ManagerTextures(gl, assets.textures, config.textures)
    }

    if (assets?.objets) {
      this.mngObj = new ManagerObjets(gl, assets.objets, assets.materials)
    }

    if (assets?.gltfs) {
      this.mngGltf = new ManagerGltfs(gl, assets.gltfs)
    }

    if (assets?.sounds) {
      this.mngSound = new ManagerSounds(assets.sounds)
    }
    this.resizeViewport()
  }

  canUseDepth() {
    return (this.config.useDepthTexture && this.config.support.depthTexture) || false
  }

  resize(box) {
    this.containerSize = box
    if (this.postProcess) {
      this.postProcess.resize(box)
    }
    if (this.bloom) {
      this.bloom.resize(box)
    }
    if (this.ssao) {
      this.ssao.resize(box)
    }
    if (this.shadow) {
      this.shadow.resize(box)
    }
    this.mngProg.updateResolution(this.containerSize.width, this.containerSize.height)
    this.resizeViewport()
  }

  update(time) {
    this.time = time
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  resizeViewport() {
    this.gl.viewport(0, 0, this.containerSize.width, this.containerSize.height)
  }

  getColorPixel(x, y) {
    const pixel = new Uint8Array(4)
    this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel)
    return pixel
  }
}
