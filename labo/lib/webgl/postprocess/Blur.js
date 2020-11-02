import ProcessBase from './ProcessBase';

export default class extends ProcessBase {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);

    const configBlur = config.blur || {};
    this.blurSize = configBlur.size !== undefined ? configBlur.size : 0.6;
    this.blurIntensity = configBlur.intensity !== undefined ? configBlur.intensity : 1.0;
  }

  // setBlur(direction, tex = null) {
  //   const program = this.applyTexToProg(this.programs.blur, tex);
  //   program.setVector('direction', direction);
  //   this.renderToPingPong(program);
  // }

  // setBlur(size = 2.0, nbPass = 1, tex = null) {
  //   for (let i = 0; i < nbPass; i += 1) {
  //     let program = this.applyTexToProg(this.programs.blurDirection, tex);
  //     program.setFloat('direction', 0.0);
  //     program.setFloat('size', size);
  //     this.renderToPingPong(program);

  //     program = this.applyTexToProg(program, tex);
  //     program.setFloat('direction', 1.0);
  //     program.setFloat('size', size);
  //     this.renderToPingPong(program);
  //   }
  // }

  setBlur(tex = null) {
    // ONE PASS
    const program = this.applyTexToProg(this.programs.blurOnePass, tex);
    program.setFloat('size', this.blurSize);
    program.setFloat('intensity', this.blurIntensity);
    this.renderToPingPong(program);
  }

  setBlurIntensity = (value) => {
    this.blurIntensity = value;
  };

  setBlurSize = (value) => {
    this.blurSize = value;
  };
}
