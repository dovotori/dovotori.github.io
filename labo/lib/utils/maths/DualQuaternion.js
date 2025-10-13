import { EPSILON } from "../constants/maths";
import Mat4 from "./Mat4";
import Quaternion from "./Quaternion";

class DualQuaternion {
  constructor() {
    this.d = new Float32Array(8);
    this.identity();
  }

  identity() {
    this.d[0] = 0;
    this.d[1] = 0;
    this.d[2] = 0;
    this.d[3] = 1;
    this.d[4] = 0;
    this.d[5] = 0;
    this.d[6] = 0;
    this.d[7] = 0;
    return this;
  }

  set(x1, y1, z1, w1, x2, y2, z2, w2) {
    this.d[0] = x1;
    this.d[1] = y1;
    this.d[2] = z1;
    this.d[3] = w1;
    this.d[4] = x2;
    this.d[5] = y2;
    this.d[6] = z2;
    this.d[7] = w2;
    return this;
  }

  add(q2) {
    this.d[0] += q2.d[0];
    this.d[1] += q2.d[1];
    this.d[2] += q2.d[2];
    this.d[3] += q2.d[3];
    this.d[4] += q2.d[4];
    this.d[5] += q2.d[5];
    this.d[6] += q2.d[6];
    this.d[7] += q2.d[7];
    return this;
  }

  translate(translate) {
    const ax1 = this.d[0];
    const ay1 = this.d[1];
    const az1 = this.d[2];
    const aw1 = this.d[3];
    const bx1 = translate[0] * 0.5;
    const by1 = translate[1] * 0.5;
    const bz1 = translate[2] * 0.5;
    const ax2 = this.d[4];
    const ay2 = this.d[5];
    const az2 = this.d[6];
    const aw2 = this.d[7];
    this.d[0] = ax1;
    this.d[1] = ay1;
    this.d[2] = az1;
    this.d[3] = aw1;
    this.d[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    this.d[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    this.d[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    this.d[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return this;
  }

  multiply(q2) {
    const ax0 = this.d[0];
    const ay0 = this.d[1];
    const az0 = this.d[2];
    const aw0 = this.d[3];
    const bx1 = q2.d[4];
    const by1 = q2.d[5];
    const bz1 = q2.d[6];
    const bw1 = q2.d[7];
    const ax1 = this.d[4];
    const ay1 = this.d[5];
    const az1 = this.d[6];
    const aw1 = this.d[7];
    const bx0 = q2.d[0];
    const by0 = q2.d[1];
    const bz0 = q2.d[2];
    const bw0 = q2.d[3];
    this.d[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    this.d[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    this.d[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    this.d[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    this.d[4] =
      ax0 * bw1 +
      aw0 * bx1 +
      ay0 * bz1 -
      az0 * by1 +
      ax1 * bw0 +
      aw1 * bx0 +
      ay1 * bz0 -
      az1 * by0;
    this.d[5] =
      ay0 * bw1 +
      aw0 * by1 +
      az0 * bx1 -
      ax0 * bz1 +
      ay1 * bw0 +
      aw1 * by0 +
      az1 * bx0 -
      ax1 * bz0;
    this.d[6] =
      az0 * bw1 +
      aw0 * bz1 +
      ax0 * by1 -
      ay0 * bx1 +
      az1 * bw0 +
      aw1 * bz0 +
      ax1 * by0 -
      ay1 * bx0;
    this.d[7] =
      aw0 * bw1 -
      ax0 * bx1 -
      ay0 * by1 -
      az0 * bz1 +
      aw1 * bw0 -
      ax1 * bx0 -
      ay1 * by0 -
      az1 * bz0;
    return this;
  }

  scale(scale) {
    this.d[0] *= scale;
    this.d[1] *= scale;
    this.d[2] *= scale;
    this.d[3] *= scale;
    this.d[4] *= scale;
    this.d[5] *= scale;
    this.d[6] *= scale;
    this.d[7] *= scale;
    return this;
  }

  rotateX(rad) {
    let bx = -this.d[0];
    let by = -this.d[1];
    let bz = -this.d[2];
    let bw = this.d[3];
    const ax = this.d[4];
    const ay = this.d[5];
    const az = this.d[6];
    const aw = this.d[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by;
    const ay1 = ay * bw + aw * by + az * bx - ax * bz;
    const az1 = az * bw + aw * bz + ax * by - ay * bx;
    const aw1 = aw * bw - ax * bx - ay * by - az * bz;
    const quat = new Quaternion(this.d[0], this.d[1], this.d[2], this.d[3]);
    quat.rotateX(rad);
    this.d[0] = quat.getX();
    this.d[1] = quat.getY();
    this.d[2] = quat.getZ();
    this.d[3] = quat.getW();
    bx = quat.getX();
    by = quat.getY();
    bz = quat.getZ();
    bw = quat.getW();
    this.d[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this.d[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this.d[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this.d[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }

  rotateY(rad) {
    let bx = -this.d[0];
    let by = -this.d[1];
    let bz = -this.d[2];
    let bw = this.d[3];
    const ax = this.d[4];
    const ay = this.d[5];
    const az = this.d[6];
    const aw = this.d[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by;
    const ay1 = ay * bw + aw * by + az * bx - ax * bz;
    const az1 = az * bw + aw * bz + ax * by - ay * bx;
    const aw1 = aw * bw - ax * bx - ay * by - az * bz;
    const quat = new Quaternion(this.d[0], this.d[1], this.d[2], this.d[3]);
    quat.rotateY(rad);
    this.d[0] = quat.getX();
    this.d[1] = quat.getY();
    this.d[2] = quat.getZ();
    this.d[3] = quat.getW();
    bx = quat.getX();
    by = quat.getY();
    bz = quat.getZ();
    bw = quat.getW();
    this.d[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this.d[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this.d[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this.d[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }

  rotateZ(rad) {
    let bx = -this.d[0];
    let by = -this.d[1];
    let bz = -this.d[2];
    let bw = this.d[3];
    const ax = this.d[4];
    const ay = this.d[5];
    const az = this.d[6];
    const aw = this.d[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by;
    const ay1 = ay * bw + aw * by + az * bx - ax * bz;
    const az1 = az * bw + aw * bz + ax * by - ay * bx;
    const aw1 = aw * bw - ax * bx - ay * by - az * bz;
    const quat = new Quaternion(this.d[0], this.d[1], this.d[2], this.d[3]);
    quat.rotateZ(rad);
    this.d[0] = quat.getX();
    this.d[1] = quat.getY();
    this.d[2] = quat.getZ();
    this.d[3] = quat.getW();
    bx = quat.getX();
    by = quat.getY();
    bz = quat.getZ();
    bw = quat.getW();
    this.d[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this.d[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this.d[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this.d[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }

  rotateAroundAxis(axis, rad) {
    if (Math.abs(rad) < EPSILON) {
      return this;
    }
    const axisLength = Math.hypot(axis[0], axis[1], axis[2]);
    const radian = rad * 0.5;
    const s = Math.sin(radian);
    const bx = (s * axis[0]) / axisLength;
    const by = (s * axis[1]) / axisLength;
    const bz = (s * axis[2]) / axisLength;
    const bw = Math.cos(radian);
    const ax1 = this.d[0];
    const ay1 = this.d[1];
    const az1 = this.d[2];
    const aw1 = this.d[3];
    this.d[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this.d[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this.d[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this.d[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    const ax = this.d[4];
    const ay = this.d[5];
    const az = this.d[6];
    const aw = this.d[7];
    this.d[4] = ax * bw + aw * bx + ay * bz - az * by;
    this.d[5] = ay * bw + aw * by + az * bx - ax * bz;
    this.d[6] = az * bw + aw * bz + ax * by - ay * bx;
    this.d[7] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }

  // lerp(q2, t) {
  //   const mt = 1 - t;
  //   if (dot(a, b) < 0) t = -t;
  //   this.d[0] = this.d[0] * mt + q2.d[0] * t;
  //   this.d[1] = this.d[1] * mt + q2.d[1] * t;
  //   this.d[2] = this.d[2] * mt + q2.d[2] * t;
  //   this.d[3] = this.d[3] * mt + q2.d[3] * t;
  //   this.d[4] = this.d[4] * mt + q2.d[4] * t;
  //   this.d[5] = this.d[5] * mt + q2.d[5] * t;
  //   this.d[6] = this.d[6] * mt + q2.d[6] * t;
  //   this.d[7] = this.d[7] * mt + q2.d[7] * t;
  //   return this;
  // }

  getTranslation() {
    const ax = this.d[4];
    const ay = this.d[5];
    const az = this.d[6];
    const aw = this.d[7];
    const bx = -this.d[0];
    const by = -this.d[1];
    const bz = -this.d[2];
    const bw = this.d[3];
    const result = [3];
    result[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    result[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    result[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return result;
  }

  toMatrix4() {
    const out = [16];
    out[0] = 1.0 - 2.0 * this.d[1] * this.d[1] - 2.0 * this.d[2] * this.d[2];
    out[1] = 2.0 * this.d[0] * this.d[1] + 2.0 * this.d[3] * this.d[2];
    out[2] = 2.0 * this.d[0] * this.d[2] - 2.0 * this.d[3] * this.d[1];
    out[3] = 0;
    out[4] = 2.0 * this.d[0] * this.d[1] - 2.0 * this.d[3] * this.d[2];
    out[5] = 1.0 - 2.0 * this.d[0] * this.d[0] - 2.0 * this.d[2] * this.d[2];
    out[6] = 2.0 * this.d[1] * this.d[2] + 2.0 * this.d[3] * this.d[0];
    out[7] = 0;
    out[8] = 2.0 * this.d[0] * this.d[2] + 2.0 * this.d[3] * this.d[1];
    out[9] = 2.0 * this.d[1] * this.d[2] - 2.0 * this.d[3] * this.d[0];
    out[10] = 1.0 - 2.0 * this.d[0] * this.d[0] - 2.0 * this.d[1] * this.d[1];
    out[11] = 0;
    out[12] =
      2.0 *
      (-this.d[7] * this.d[0] +
        this.d[4] * this.d[3] -
        this.d[5] * this.d[2] +
        this.d[6] * this.d[1]);
    out[13] =
      2.0 *
      (-this.d[7] * this.d[1] +
        this.d[4] * this.d[2] +
        this.d[5] * this.d[3] -
        this.d[6] * this.d[0]);
    out[14] =
      2.0 *
      (-this.d[7] * this.d[2] -
        this.d[4] * this.d[1] +
        this.d[5] * this.d[0] +
        this.d[6] * this.d[3]);
    out[15] = 1;
    const mat4 = new Mat4();
    return mat4.setFromArray(out);
  }

  get() {
    return this.d;
  }
}

export default DualQuaternion;
