import Program from '../gl/Program';
import * as glsl from '../shaders';
import * as glslScreen from '../shaders/screen';
import * as glslParticules from '../shaders/particules';

export default class {
  constructor(gl, selection) {
    this.programs = {};
    selection.forEach((name) => {
      if (glsl[name]) {
        const shader = glsl[name];
        this.programs[name] = new Program(gl, shader);
      } else if (glslScreen[name]) {
        const shader = glslScreen[name];
        this.programs[name] = new Program(gl, shader);
      } else if (glslParticules[name]) {
        const shader = glslParticules[name];
        this.programs[name] = new Program(gl, shader);
      }
    });
  }

  setCameraMatrix(camera) {
    Object.keys(this.programs).forEach((name) => {
      this.programs[name].setMatrix('view', camera.getView().get());
      this.programs[name].setMatrix('projection', camera.getProjection().get());
    });
  }

  get(id) {
    return this.programs[id];
  }
}
