import Vec3 from "../maths/Vec3";
import Mat4 from "../maths/Mat4";

export default class {
  constructor(config) {
    this.position = new Vec3(
      config.position.x,
      config.position.y,
      config.position.z
    );
    this.target = new Vec3(
      config.target.x ?? 0,
      config.target.y ?? 0,
      config.target.z ?? 0
    );
    this.view = new Mat4();
    if (config.ortho) {
      const { left, right, bottom, top } = config.ortho;
      const { near, far } = config;
      this.ortho = new Mat4().orthoWebGpu(left, right, bottom, top, near, far);
      // this.ortho = new Mat4().ortho(left, right, bottom, top, near, far);
    }
  }

  lookAt() {
    this.view
      .identity()
      .lookAt(
        this.position.getX(),
        this.position.getY(),
        this.position.getZ(),
        this.target.getX(),
        this.target.getY(),
        this.target.getZ(),
        0,
        1,
        0
      );
  }

  getView() {
    return this.view;
  }

  getPosition() {
    return this.position.get();
  }

  getPositionVec3() {
    return this.position;
  }

  getTarget() {
    return this.target.get();
  }

  getModel() {
    return this.repere.getModel();
  }

  getOrtho() {
    return this.ortho;
  }

  addToPosition(x, y, z) {
    this.position.addXYZ(x, y, z);
    this.lookAt();
  }

  setPosition(x = null, y = null, z = null) {
    const newX = x !== null ? x : this.position.getX();
    const newY = y !== null ? y : this.position.getY();
    const newZ = z !== null ? z : this.position.getZ();
    this.position.set(newX, newY, newZ);
    this.lookAt();
  }

  setTarget(x, y, z) {
    this.target.set(x, y, z);
  }

  setTargetVec3(v) {
    this.target.equal(v);
  }
}
