import primitive from '../../utils-3d/primitives/plane';
import Primitive from './Primitive';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.objet = new Primitive(gl, primitive);
  }

  render(program) {
    this.gl.disable(this.gl.CULL_FACE);
    this.objet.render(program);
    this.gl.enable(this.gl.CULL_FACE);
  }
}
