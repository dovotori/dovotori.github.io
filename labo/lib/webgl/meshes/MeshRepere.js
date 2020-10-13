import Objet from '../gl/ObjetPrimitive';
import Mat4 from '../maths/Mat4';
import primitive from '../primitives/cube';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.objet = new Objet(this.gl);
    this.objet.setIndices(primitive.indice);
    this.objet.setPoints(primitive.position, 'position');

    this.model = new Mat4();
    this.model.identity();
  }

  render(program) {
    program.setMatrix('model', this.model.get());
    this.objet.enable(program.get(), 'position', 3);
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
