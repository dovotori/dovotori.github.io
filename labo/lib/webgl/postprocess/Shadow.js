import Blur from './Blur';

export default class extends Blur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);
    const program = this.programs.shadow;
    program.setFloat('shadowEpsilon', config.epsilon || 0.01);
    program.setFloat('lighten', config.lighten || 0.0);
  }

  start(lampe) {
    const program = this.programs.shadow;
    lampe.setShadowProgram(program);
    super.start();
  }

  getProgram = () => {
    return this.programs.shadow;
  };
}
