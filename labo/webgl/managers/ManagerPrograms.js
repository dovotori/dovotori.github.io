import Program from '../gl/Program';

export default class {
  constructor(gl, shaders, resolution) {
    this.programs = {};

    Object.keys(shaders).forEach((name) => {
      const shader = shaders[name];
      this.programs[name] = new Program(gl, shader);
      if (shader.uniforms.indexOf('resolution') !== -1) {
        this.programs[name].setVector('resolution', [resolution.width, resolution.height]);
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

  getAll = () => this.programs;
}
