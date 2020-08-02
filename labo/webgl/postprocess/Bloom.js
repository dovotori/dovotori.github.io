import ProcessBase from './ProcessBase';
import Program from '../gl/Program';
import { emissive } from '../shaders';
import { blurDirection } from '../shaders/screen';

export default class extends ProcessBase {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    super(gl, width, height, useDepth);
    const glsl = { emissive, blurDirection };

    this.programs = {};
    Object.keys(glsl).forEach((effect) => {
      this.programs[effect] = new Program(this.gl, glsl[effect]);
      // pass resolution for effect which need it
      if (glsl[effect].uniforms.indexOf('resolution') !== -1) {
        this.programs[effect].setVector('resolution', [this.width, this.height]);
      }
    });
  }

  compute(renderScene, projection, view) {
    const program = this.programs.emissive;
    program.setMatrix('projection', projection);
    program.setMatrix('view', view);
    this.start();
    renderScene(program);
    this.end();
    this.setBlurPass(0.6, 2);
  }

  setBlurPass(size = 2.0, nbPass = 1, tex = null) {
    for (let i = 0; i < nbPass; i += 1) {
      let program = this.applyTexToProg(this.programs.blurDirection, tex);
      program.setFloat('direction', 0.0);
      program.setFloat('size', size);
      this.renderToPingPong(program);

      program = this.applyTexToProg(program, tex);
      program.setFloat('direction', 1.0);
      program.setFloat('size', size);
      this.renderToPingPong(program);
    }
  }
}
