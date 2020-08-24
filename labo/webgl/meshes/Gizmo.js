import ObjetVbo from '../gl/ObjetVbo';

export default class {
  constructor(gl) {
    this.gl = gl;

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

  render(camera, model, program) {
    model.push();
    model.scale(20);
    program.setMatrix('model', model.get());
    program.setMatrix('view', camera.getView().get());
    program.setMatrix('projection', camera.getProjection().get());
    this.objet.render(program);
    model.pop();
  }

  getModel() {
    return this.model;
  }
}
