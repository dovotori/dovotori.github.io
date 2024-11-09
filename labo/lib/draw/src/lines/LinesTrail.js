import Line from "./Line";
import { hexToRgb } from "../../color";
// import Target from '../maths/Target';

export default class {
  constructor(gl) {
    this.colors = ["#e09f7d", "#ef5d60", "#ec4067", "#a01a7d", "#311847"].map(
      (hex) => {
        const { r, g, b } = hexToRgb(hex);
        return [r / 255, g / 255, b / 255];
      },
    );
    this.lines = this.colors.map(
      (_, i) =>
        new Line(gl, 20, {
          spring: 0.06 * i,
          friction: 0.85 + i * 0.02,
        }),
    );
    this.mousePos = { x: 0, y: 0 };
    this.weight = 0; // new Target(0, 0.01);
  }

  update(program) {
    program.setFloat("time", this.time);
    this.lines.forEach((line) => line.update(this.mousePos));
  }

  render(program) {
    program.setFloat("weight", this.weight);
    this.lines.forEach((line, i) => {
      program.setVector("color", this.colors[i]);
      line.render(program.get());
    });
  }

  onMouseDrag = (mouse) => {
    this.mousePos = mouse.rel;
    // this.weight.setDirect(mouse.speed * 0.01);
    this.weight = mouse.speed * 0.01;
  };

  onMouseDown = (mouse) => {
    this.mousePos = mouse.rel;
    this.lines.forEach((line) => line.init([mouse.rel.x, mouse.rel.y, 0]));
  };
}
