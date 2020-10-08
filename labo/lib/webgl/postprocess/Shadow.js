import WithBlur from './WithBlur';

export default class extends WithBlur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);
    const program = this.programs.shadow;
    program.setFloat('shadowEpsilon', config.epsilon || 0.01);
  }

  compute(renderScene, lampe) {
    const program = this.programs.shadow;
    program.setTexture(2, lampe.getDepthTexture().get(), 'shadowMap');
    program.setMatrix('shadowView', lampe.getView().get());
    program.setMatrix('shadowProjection', lampe.getOrtho().get());
    program.setVector('posLum', lampe.getPosition());
    this.start();
    renderScene(program);
    this.end();
  }
}
