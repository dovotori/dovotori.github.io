import Spring from "../maths/Spring";
import Camera from "./Camera";

export default class extends Camera {
  constructor(options) {
    super(options);
    this.rotationX = new Spring();
    this.options = options;
  }

  update() {
    super.update();
    this.rotationX.update();
    this.position.set(
      this.options.position.x +
        Math.sin(this.rotationX.get() * 0.01) * this.options.position.z,
      this.options.position.y,
      Math.cos(this.rotationX.get() * 0.01) * this.options.position.z
    );
  }

  setDraggingPosition(pos) {
    this.rotationX.addToSpeed(pos.relPrevious.x * 0.1);
  }
}
