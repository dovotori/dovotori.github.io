import Primitive from '../gl/Primitive';
import Mat4 from '../maths/Mat4';
import primitive from '../primitives/cube';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.objet = new Primitive(this.gl, primitive);

    this.model = new Mat4();
    this.model.identity();
  }

  render(program) {
    program.setMatrix('model', this.model.get());
    this.objet.render(program.get());
  }

  update(pos, size) {
    this.model
      .identity()
      .scale(size.getX(), size.getY(), size.getZ())
      .translate(pos.getX(), pos.getY(), pos.getZ());
  }

  getModel() {
    return this.model;
  }
}
