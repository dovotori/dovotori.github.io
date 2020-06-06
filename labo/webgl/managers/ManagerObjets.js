import Objet from "../gl/ObjetObj";

export default class {
  constructor(gl, objets, materials = null) {
    this.objets = {};
    Object.keys(objets).forEach((name) => {
      this.objets[name] = new Objet(
        gl,
        objets[name],
        materials && materials[name]
      );
    });
  }

  get(id) {
    return this.objets[id];
  }
}
