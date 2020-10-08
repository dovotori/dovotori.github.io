import ProcessBase from './ProcessBase';

export default class extends ProcessBase {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);

    const configBlur = config.blur || {};
    this.blurSize = configBlur.size !== undefined ? configBlur.size : 0.6;
    this.blurIntensity = configBlur.intensity !== undefined ? configBlur.intensity : 1.0;
  }

  setBlurPass(tex = null) {
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
