import Objet from '../gl/ObjetGltf';

export default class {
  constructor(gl, gltfs) {
    this.gltfs = {};
    Object.keys(gltfs).forEach((name) => {
      this.gltfs[name] = new Objet(gl, gltfs[name]);
    });
  }

  get(id) {
    return this.gltfs[id];
  }
}
