import ProcessBase from './ProcessBase';

export default class extends ProcessBase {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);

    this.blurSize = config.size !== undefined ? config.size : 0.6;
    this.blurIntensity = config.intensity !== undefined ? config.intensity : 1.0;

    this.setStaticValues();
  }

  setStaticValues = () => {
    const program = this.programs.blurOnePass;
    program.setFloat('size', this.blurSize);
    program.setFloat('intensity', this.blurIntensity);
  };

  end() {
    // this.setBlurPass();
    this.ppb.end();
  }

  setBlurPass(tex = null) {
    // ONE PASS
    const program = this.applyTexToProg(this.programs.blurOnePass, tex);
    program.setFloat('size', this.blurSize);
    program.setFloat('intensity', this.blurIntensity);
    this.renderToPingPong(program);
  }

  // setBlurMultiPass() {
  // MULTIPASS
  // for (let i = 0; i < this.blurNbPass; i += 1) {
  //   let program = this.applyTexToProg(this.programs.blurMultiPass, tex);
  //   program.setFloat('direction', 0.0);
  //   program.setFloat('size', this.blurSize);
  //   program.setFloat('intensity', this.blurIntensity);
  //   this.renderToPingPong(program);

  //   program = this.applyTexToProg(program, tex);
  //   program.setFloat('direction', 1.0);
  //   program.setFloat('size', this.blurSize);
  //   program.setFloat('size', this.blurIntensity);
  //   this.renderToPingPong(program);
  // }
  // }

  setIntensity = (value) => {
    this.blurIntensity = value;
  };

  setNbPass = (value) => {
    this.blurNbPass = value;
  };

  setSize = (value) => {
    this.blurSize = value;
  };
}
