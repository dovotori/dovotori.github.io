import { Spring, Target } from "../maths";
import Mesh from "./Mesh";

export default class extends Mesh {
  constructor() {
    super();
    this.angle = { x: new Spring(), y: new Spring() };
    this.selected = false;
    this.size = new Target(1, { sampling: 0.1 });
  }

  setProgramSpecifics(program) {
    super.setProgramSpecifics(program);
    program.setInt("selected", this.selected);
  }

  renderColor(objet, program) {
    program.setInt("selected", this.selected);
    super.renderColor(objet, program);
  }

  setDraggingInfos(pos) {
    this.angle.x.addToSpeed(pos.relPrevious.x * 0.1);
    this.angle.y.addToSpeed(pos.relPrevious.y * -0.1);
  }

  setSelected(pixel) {
    this.selected = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255;
    this.size.set(this.selected ? 1.1 : 1);
  }
}
