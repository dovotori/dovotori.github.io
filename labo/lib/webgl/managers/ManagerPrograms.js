import Program from '../gl/Program';
import { later } from '../../../utils';

export default class {
  constructor() {
    this.programs = {};
  }

  async setup(gl, shaders, resolution) {
    const startTime = performance.now();
    /*
    // linear loading
    Object.keys(shaders).forEach((name) => {
      const shader = shaders[name];
      this.programs[name] = new Program(gl, shader);
    });
    */
    function* generateProgram() {
      const shadersKeys = Object.keys(shaders);
      for (let i = 0; i < shadersKeys.length; i++) {
        const name = shadersKeys[i];
        const shader = shaders[name];
        yield { prog: new Program(gl, shader), name };
      }
    }
    const generator = generateProgram();
    for (const item of generator) {
      await later();
      this.programs[item.name] = item.prog;
    }

    console.log('programs', performance.now() - startTime);
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
