import Program from '../gl/Program';

export default class {
  constructor(gl, shaders, resolution) {
    this.programs = {};

    Object.keys(shaders).forEach((name) => {
      const shader = shaders[name];
      this.programs[name] = new Program(gl, shader);
    });
    this.updateResolution(resolution.width, resolution.height);
  }

  setCameraMatrix(camera, isOrtho = false) {
    Object.keys(this.programs).forEach((name) => {
      this.programs[name].setMatrix('view', camera.getView().get());
      const proj = isOrtho ? camera.getOrtho() : camera.getProjection();
      this.programs[name].setMatrix('projection', proj.get());
    });
  }

  updateResolution = (width, height) => {
    Object.keys(this.programs).forEach((name) => {
      this.programs[name].setVector('resolution', [width, height]);
    });
  };

  get(id) {
    return this.programs[id];
  }

  getAll = () => this.programs;
}
