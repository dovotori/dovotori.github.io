import Scene from '../webgl/scenes/Scene';
import Screen from '../webgl/gl/Screen';
import Line from '../webgl/gl/Line';
import { hexToRgb } from '../webgl/utils/color';
import Target from '../webgl/maths/Target';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.MAIN_PROG = config.MAIN_PROG;
    this.MAIN_OBJ = config.MAIN_OBJ;

    this.screen = new Screen(this.gl);
    this.colors = ['#e09f7d', '#ef5d60', '#ec4067', '#a01a7d', '#311847'].map((hex) => {
      const { r, g, b } = hexToRgb(hex);
      return [r / 255, g / 255, b / 255];
    });
    this.lines = this.colors.map((_, i) => {
      return new Line(gl, 20, {
        spring: 0.06 * i,
        friction: 0.85 + i * 0.02,
      });
    });
    this.mousePos = { x: 0, y: 0 };
    this.weight = 0; // new Target(0, 0.01);
  }

  update() {
    super.update();
    const program = this.mngProg.get(this.MAIN_PROG);
    // program.setVector('resolution', [this.containerSize.width, this.containerSize.height]);
    program.setFloat('time', this.time);
    this.lines.forEach((line) => line.update(this.mousePos));
  }

  render() {
    super.render();
    // this.screen.render(this.mngProg.get(this.MAIN_PROG).get());
    const program = this.mngProg.get(this.MAIN_PROG);
    // this.weight.update();
    program.setFloat('weight', this.weight);
    this.lines.forEach((line, i) => {
      program.setVector('color', this.colors[i]);
      line.render(program.get());
    });
    // DEBUG
    // this.postProcess.render(texData.get());
  }

  onMouseDrag = (mouse) => {
    this.mousePos = mouse.rel;
    console.log('+++', mouse.speed);
    // this.weight.setDirect(mouse.speed * 0.01);
    this.weight = mouse.speed * 0.01;
  };

  onMouseDown = (mouse) => {
    this.mousePos = mouse.rel;
    this.lines.forEach((line) => line.init([mouse.rel.x, mouse.rel.y, 0]));
  };
}
