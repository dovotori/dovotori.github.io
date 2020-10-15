import WithBlur from './WithBlur';

export default class extends WithBlur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);
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

  setNbPass = (value) => {
    this.blurNbPass = value;
  };
}
