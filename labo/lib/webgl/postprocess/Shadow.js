import Blur from './Blur';

export default class extends Blur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);
    const program = this.programs.shadow;
    program.setFloat('shadowEpsilon', config.epsilon || 0.01);
    program.setFloat('lighten', config.lighten || 0.0);
  }

  start(lampe) {
    super.start();
    const program = this.programs.shadow;
    program.setTexture(2, lampe.getDepthTexture().get(), 'shadowMap');
    program.setMatrix('shadowView', lampe.getView().get());
    program.setMatrix('shadowProjection', lampe.getOrtho().get());
    program.setVector('posLum', lampe.getPosition());
  }

  getProgram = () => {
    return this.programs.shadow;
  };
}
