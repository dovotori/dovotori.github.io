import TextureImage from '../textures/TextureImage'

export default class {
  constructor(gl, textures, config = {}) {
    this.textures = {}
    Object.keys(textures).forEach((name) => {
      this.textures[name] = new TextureImage(gl, textures[name], config[name])
    })
  }

  get(id) {
    return this.textures[id]
  }
}
