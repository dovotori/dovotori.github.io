import Program from '../gl/Program';
import glsl from '../constants/shaders/albedo';
import ObjetVbo from '../gl/ObjetVbo';

export default class {
  constructor(gl) {
    this.gl = gl;
    this.program = new Program(this.gl, glsl);

    const points = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
    const colors = [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1];
    const indices = [0, 1, 2, 3, 4, 5];

    const vbos = {
      position: {
        values: new Float32Array(points),
        count: points.length / 3,
        size: 3,
        componentType: 5126,
      },
      diffuse: {
        values: new Float32Array(colors),
        count: colors.length / 3,
        size: 3,
        componentType: 5126,
      },
      indices: {
        values: new Uint16Array(indices),
        count: indices.length,
        size: 1,
        type: 'SCALAR',
        componentType: 5123,
      },
    };

    this.objet = new ObjetVbo(gl, vbos);
    this.objet.setModeDessin(this.gl.LINES);
  }

  render(camera, model) {
    model.push();
    model.scale(20);
    this.program.setMatrix('model', model.get());
    this.program.setMatrix('view', camera.getView().get());
    this.program.setMatrix('projection', camera.getProjection().get());
    this.objet.render(this.program);
    model.pop();
  }

  getModel() {
    return this.model;
  }
}
