import ObjetPrimitive from './ObjetPrimitive';
import primitive from '../constants/primitives/plane';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.objet = new ObjetPrimitive(this.gl);
    this.setupObjet();
  }

  setupObjet() {
    Object.keys(primitive).forEach((key) => {
      if (key === 'indice') {
        this.objet.setIndices(primitive.indice);
      } else {
        this.objet.setPoints(primitive[key], key);
      }
    });
  }

  resize() {}

  render(program) {
    this.objet.enable(program, 'position', 3);
    this.objet.enable(program, 'texture', 2);
    this.gl.disable(this.gl.CULL_FACE);
    this.objet.render(program);
    this.gl.enable(this.gl.CULL_FACE);
  }
}
