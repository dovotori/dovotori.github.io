import DualQuaternion from "../../utils/maths/DualQuaternion";
import Spring from "../../utils/maths/Spring";
import Target from "../../utils/maths/Target";
import { degToRad } from "../../utils/numbers";

export class MouseInteraction {
  constructor() {
    this.targetX = new Spring(0);
    this.targetZ = new Target(0.0001, 0.05);
    this.targetZ.set(1.2);
  }

  update() {
    this.targetX.update();
    this.targetZ.update();
  }

  getRotation(time) {
    const angle = degToRad(this.targetX.get()) + time * 0.0001;
    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    return quat.toMatrix4();
  }

  getTargetX() {
    return this.targetX;
  }

  getTargetZ() {
    return this.targetZ;
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
  };

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 1.2);
    target = Math.max(target, 0.8);
    this.targetZ.set(target);
  };
}
