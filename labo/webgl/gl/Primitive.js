import ObjetPrimitive from './ObjetPrimitive';

export default class {
  constructor(gl, primitive, isDynamic = false) {
    this.gl = gl;
    this.objet = new ObjetPrimitive(this.gl, isDynamic);
    this.setupObjet(primitive);
  }

  setupObjet(primitive) {
    Object.keys(primitive).forEach((key) => {
      if (key === 'indice') {
        this.objet.setIndices(primitive.indice);
      } else {
        this.objet.setPoints(primitive[key], key);
      }
    });
  }

  update(primitive) {
    Object.keys(primitive).forEach((key) => {
      this.objet.setPoints(primitive[key], key);
    });
  }

  render(program) {
    this.objet.enable(program, 'position', 3);
    this.objet.enable(program, 'texture', 2);
    this.gl.disable(this.gl.CULL_FACE);
    this.objet.render();
    this.gl.enable(this.gl.CULL_FACE);
  }
}
