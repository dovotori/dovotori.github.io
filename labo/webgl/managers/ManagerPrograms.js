import Program from '../gl/Program';
import glslGroup from '../shaders';

export default class {
  constructor(gl, selection) {
    this.programs = {};

    const glsl = Object.keys(glslGroup).reduce((result, groupId) => {
      return { ...glslGroup[groupId], ...result };
    }, {});

    selection.forEach((name) => {
      if (glsl[name]) {
        const shader = glsl[name];
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
