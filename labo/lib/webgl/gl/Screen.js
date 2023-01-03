import Primitive from "./Primitive";
import primitive from "../primitives/plane";

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
