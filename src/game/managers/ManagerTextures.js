import { TextureImage } from '../textures';

export default class {
  constructor(gl, textures) {
    this.textures = {};
    Object.keys(textures).forEach((name) => {
      this.textures[name] = new TextureImage(gl, textures[name]);
    });
  }

  get(id) {
    return this.textures[id];
  }
}
