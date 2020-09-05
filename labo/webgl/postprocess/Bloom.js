import ProcessBase from './ProcessBase';

export default class extends ProcessBase {
  constructor(gl, width = 1024, height = 1024, useDepth = false, programs = {}, config = {}) {
    super(gl, width, height, useDepth, programs);

    this.blurSize = config.size !== undefined ? config.size : 0.6;
    this.blurIntensity = config.intensity !== undefined ? config.intensity : 1.0;
  }

  render(tex = null, isDebug = false) {
    super.render(tex, isDebug);
  }

  end() {
    this.setBlurPass();
    this.ppb.end();
  }

  setBlurPass(tex = null) {
    // ONE PASS
    const program = this.applyTexToProg(this.programs.blurBloomOnePass, tex);
    program.setFloat('size', this.blurSize);
    program.setFloat('intensity', this.blurIntensity);
    this.renderToPingPong(program);

    // MULTIPASS
    // for (let i = 0; i < this.blurNbPass; i += 1) {
    //   let program = this.applyTexToProg(this.programs.blurBloomMultiPass, tex);
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
  }

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
