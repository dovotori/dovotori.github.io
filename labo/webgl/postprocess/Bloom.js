import ProcessBase from './ProcessBase';
import Program from '../gl/Program';
import { blurBloomOnePass } from '../shaders/screen';

export default class extends ProcessBase {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    super(gl, width, height, useDepth);
    const glsl = { blurBloomOnePass };

    Object.keys(glsl).forEach((effect) => {
      this.programs[effect] = new Program(this.gl, glsl[effect]);
      // pass resolution for effect which need it
      if (glsl[effect].uniforms.indexOf('resolution') !== -1) {
        this.programs[effect].setVector('resolution', [this.width, this.height]);
      }
    });

    this.blurSize = 0.6;
    this.blurNbPass = 0.6;
    this.blurIntensity = 1.0;
  }

  render(tex = null, isDebug = false) {
    this.setBlurPass();
    super.render(tex, isDebug);
  }

  setBlurPass(tex = null) {
    // ONE PASS
    const program = this.applyTexToProg(this.programs.blurBloomOnePass, tex);
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
