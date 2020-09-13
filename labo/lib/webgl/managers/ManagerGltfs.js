import Objet from '../gl/ObjetGltf';
import ObjetSkin from '../gl/ObjetGltfSkin';

export default class {
  constructor(gl, gltfs) {
    this.gltfs = {};
    Object.keys(gltfs).forEach((name) => {
      if (gltfs[name].skins) {
        this.gltfs[name] = new ObjetSkin(gl, gltfs[name]);
      } else {
        this.gltfs[name] = new Objet(gl, gltfs[name]);
      }
    });
  }

  get(id) {
    return this.gltfs[id];
  }
}
