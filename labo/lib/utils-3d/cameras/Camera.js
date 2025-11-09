import Mat4 from '../../utils/maths/Mat4';
import Vec3 from '../../utils/maths/Vec3';
import Objectif from './Objectif';

export default class extends Objectif {
  constructor(config) {
    super(config);

    // MATRICES
    this.matIdentity = new Mat4();
    this.projection = new Mat4();
    this.projection.identity();

    this.near = config.near ?? 1.0;
    this.far = config.far ?? 100.0;

    this.angle = config.angle ?? 50;
    this.matIdentity.identity();

    this.lookAt();
  }

  update() {
    this.lookAt();
  }

  perspective(w, h) {
    this.projection.identity().perspective(this.angle, w / h, this.near, this.far);
  }

  moveAroundCenter(time, offset = 0) {
    this.position.set(
      Math.cos(time) * offset,
      Math.sin(time) * (2.0 + offset),
      // this.position.getY(),
      Math.sin(time) * offset,
    );
    this.lookAt();
  }

  move(time, offset = 0) {
    this.position.set(
      // Math.cos(time * 0.02) * (2.0 + offset),
      // 2.0,
      // Math.sin(time * 0.02) * (4.0 + offset),
      // Math.sin(time * 0.02) * (2.0 + offset)
      // this.position.getY(),
      // this.position.getZ()

      this.position.getX(),
      Math.sin(time * 0.02) * (2.0 + offset),
      this.position.getZ(),
    );
    this.lookAt();
  }

  setNearFar(near, far) {
    this.near = near;
    this.far = far;
  }

  setAngle(value) {
    this.angle = value;
  }

  getModeProjection() {
    return this.ortho ?? this.projection;
  }

  getProjection() {
    return this.projection;
  }

  getViewProjection() {
    const vp = new Mat4();
    vp.identity();
    vp.multiply(this.getView());
    vp.multiply(this.getProjection());
    return vp;
  }

  getInverseViewProjection() {
    const vp = this.getViewProjection();
    return vp.inverse();
  }

  /**
   * NDC = Normalized Device Coordinates.
   * Unproject NDC coords (x,y in [-1..1], z in [0..1]) to world space.
   * Returns a new Vec3 (mutating internally then returned).
   */
  unproject(x, y, z = 0.5) {
    const ndc = new Vec3(x, y, z);
    const ivp = this.getInverseViewProjection(); // Mat4
    return ndc.multiplyMatrix(ivp);
  }

  /**
   * Returns a world-space ray for NDC x,y:
   * { origin: Vec3 (point at near plane), dir: Vec3 (normalized direction) }
   *  [-1, 1]. x = -1 is left, +1 is right; y = -1 is bottom, +1 is top
   */
  getRayFromNDC(x, y) {
    const ivp = this.getInverseViewProjection();
    const near = new Vec3(x, y, 0).multiplyMatrix(ivp);
    const far = new Vec3(x, y, 1).multiplyMatrix(ivp);
    const dir = new Vec3(far.getX(), far.getY(), far.getZ()).minus(near).normalise();
    return { origin: near, dir };
  }

  getIdentity() {
    return this.matIdentity;
  }

  getNearFar() {
    return [this.near, this.far];
  }

  getNear() {
    return this.near;
  }

  getFar() {
    return this.far;
  }

  getAngle() {
    return this.angle;
  }

  getReflectViewMatrix(waterLevel = 0) {
    const distanceY = 2 * (this.position.getY() - waterLevel);
    return new Mat4()
      .identity()
      .lookAt(
        this.position.getX(),
        this.position.getY() - distanceY,
        this.position.getZ(),
        this.target.getX(),
        this.target.getY(),
        this.target.getZ(),
        0,
        1,
        0,
      );
  }
}
