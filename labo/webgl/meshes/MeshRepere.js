import Program from '../gl/Program';
import Objet from '../gl/ObjetPrimitive';
import Mat4 from '../maths/Mat4';
import glsl from '../constants/shaders/basique3d';
import primitive from '../primitives/cube';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.program = new Program(this.gl, glsl);
    this.objet = new Objet(this.gl);
    this.objet.setIndices(primitive.indice);
    this.objet.setPoints(primitive.position, 'position');

    this.model = new Mat4();
    this.model.identity();
  }

  render(camera) {
    this.program.setMatrix('model', this.model.get());
    this.program.setMatrix('view', camera.getView().get());
    this.program.setMatrix('projection', camera.getProjection().get());
    this.objet.enable(this.program.get(), 'position', 3);
    this.objet.render(this.program.get());
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
