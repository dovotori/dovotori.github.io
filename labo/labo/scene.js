import Scene from '../lib/webgl/scenes/Scene';
import Screen from '../lib/webgl/gl/Screen';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.screen = new Screen(this.gl);
  }

  update() {
    super.update();
    const program = this.mngProg.get(this.config.MAIN_PROG);
    // program.setVector('resolution', [this.containerSize.width, this.containerSize.height]);
    program.setFloat('time', this.time);
  }

  render() {
    super.render();
    this.screen.render(this.mngProg.get(this.config.MAIN_PROG).get());
    // DEBUG
    // this.postProcess.render(texData.get());
  }
}
