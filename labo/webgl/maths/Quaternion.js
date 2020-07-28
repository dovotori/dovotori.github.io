import Vec3 from './Vec3';
import Mat4 from './Mat4';
import { EPSILON } from '../constants/maths';

class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(quaternion) {
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
    this.w = quaternion.w;
    return this;
  }

  setFromAxeAndAngle(axe, angle) {
    const [x, y, z] = axe;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = angle;
    return this;
  }

  add(quaternion) {
    this.x += quaternion.x;
    this.y += quaternion.y;
    this.z += quaternion.z;
    this.w += quaternion.w;
    return this;
  }

  approx(quaternion, tolerance) {
    return (
      Math.abs(this.x - quaternion.x) <= tolerance &&
      Math.abs(this.y - quaternion.y) <= tolerance &&
      Math.abs(this.z - quaternion.z) <= tolerance &&
      Math.abs(this.w - quaternion.w) <= tolerance
    );
  }

  dot(quaternion) {
    return (
      this.x * quaternion.x + this.y * quaternion.y + this.z * quaternion.z + this.w * quaternion.w
    );
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  multiplyArray(array) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = array[0];
    const by = array[1];
    const bz = array[2];
    const bw = array[3];
    this.x = ax * bw + aw * bx + ay * bz - az * by;
    this.y = ay * bw + aw * by + az * bx - ax * bz;
    this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }

  multiply(q2) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = q2.x;
    const by = q2.y;
    const bz = q2.z;
    const bw = q2.w;
    this.x = ax * bw + aw * bx + ay * bz - az * by;
    this.y = ay * bw + aw * by + az * bx - ax * bz;
    this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }

  multiplyVector(vector) {
    const ix = this.w * vector.x + this.y * vector.z - this.z * vector.y;
    const iy = this.w * vector.y + this.z * vector.x - this.x * vector.z;
    const iz = this.w * vector.z + this.x * vector.y - this.y * vector.x;
    const iw = -this.x * vector.x - this.y * vector.y - this.z * vector.z;
    const x = ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y;
    const y = iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z;
    const z = iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x;
    return new Vec3(x, y, z);
  }

  normalize() {
    let mag = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    if (mag !== 0.0 && mag !== 1.0) {
      mag = 1.0 / Math.sqrt(mag);
      this.x *= mag;
      this.y *= mag;
      this.z *= mag;
      this.w *= mag;
    }
    return this;
  }

  rotateX(rad) {
    const radian = rad * 0.5;
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = Math.sin(radian);
    const bw = Math.cos(radian);
    this.x = ax * bw + aw * bx;
    this.y = ay * bw + az * bx;
    this.z = az * bw - ay * bx;
    this.w = aw * bw - ax * bx;
    return this;
  }

  rotateY(rad) {
    const radian = rad * 0.5;
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const by = Math.sin(radian);
    const bw = Math.cos(radian);
    this.x = ax * bw - az * by;
    this.y = ay * bw + aw * by;
    this.z = az * bw + ax * by;
    this.w = aw * bw - ay * by;
    return this;
  }

  rotateZ(rad) {
    const radian = rad * 0.5;
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bz = Math.sin(radian);
    const bw = Math.cos(radian);
    this.x = ax * bw + ay * bz;
    this.y = ay * bw - ax * bz;
    this.z = az * bw + aw * bz;
    this.w = aw * bw - az * bz;
    return this;
  }

  scale(scalar) {
    let mag = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    if (mag === 0.0) {
      return this;
    }
    if (mag === 1.0) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      this.w *= scalar;
      return this;
    }
    mag = scalar / Math.sqrt(mag);
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
    this.w *= mag;
    return this;
  }

  sub(quaternion) {
    this.x -= quaternion.x;
    this.y -= quaternion.y;
    this.z -= quaternion.z;
    this.w -= quaternion.w;
    return this;
  }

  slerpArray(a, b, step) {
    const qa = new Quaternion(a[0], a[1], a[2], a[3]);
    const qb = new Quaternion(b[0], b[1], b[2], b[3]);
    this.slerp(qa, qb, step);
  }

  // slerp(a, b, step) {
  //   // Return early if step is out of bounds [0, 1].
  //   if (step <= 0.0) {
  //     return this.set(a);
  //   } if (step >= 1.0) {
  //     return this.set(b);
  //   }

  //   // dot product = cos(t).
  //   let cos = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

  //   // Prefer the shortest distance by flipping
  //   // the destination's sign if cos(t) is negative.
  //   if (cos < 0.0) {
  //     this.x = -b.x;
  //     this.y = -b.y;
  //     this.z = -b.z;
  //     this.w = -b.w;
  //     cos = -cos;
  //   } else {
  //     this.x = b.x;
  //     this.y = b.y;
  //     this.z = b.z;
  //     this.w = b.w;
  //   }

  //   // If cosine is out of bounds, return the origin.
  //   if (cos >= 1.0) {
  //     this.x = a.x;
  //     this.y = a.y;
  //     this.z = a.z;
  //     this.w = a.w;
  //     return this;
  //   }

  //   const sin = Math.sqrt(1.0 - cos * cos);
  //   console.log(sin);
  //   if (Math.abs(sin) < EPSILON) {
  //     this.w = 0.5 * (a.w + this.w);
  //     this.x = 0.5 * (a.x + this.x);
  //     this.y = 0.5 * (a.y + this.y);
  //     this.z = 0.5 * (a.z + this.z);

  //     return this;
  //   }

  //   // Interpolation.
  //   const theta = Math.atan2(sin, cos);
  //   const u = Math.sin((1.0 - step) * theta) / sin;
  //   const t = Math.sin(step * theta) / sin;
  //   this.x = u * a.x + t * b.x;
  //   this.y = u * a.y + t * b.y;
  //   this.z = u * a.z + t * b.z;
  //   this.w = u * a.w + t * b.w;
  //   return this;
  // }

  slerp(a, b, t) {
    const ax = a.x;
    const ay = a.y;
    const az = a.z;
    const aw = a.w;

    let bx = b.x;
    let by = b.y;
    let bz = b.z;
    let bw = b.w;

    let omega;
    let cosom;
    let sinom;
    let scale0;
    let scale1;
    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    // calculate coefficients
    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }

    // calculate final values
    this.x = scale0 * ax + scale1 * bx;
    this.y = scale0 * ay + scale1 * by;
    this.z = scale0 * az + scale1 * bz;
    this.w = scale0 * aw + scale1 * bw;
    return this;
  }

  // toMat4() {
  //   const x2 = this.x + this.x;
  //   const y2 = this.y + this.y;
  //   const z2 = this.z + this.z;

  //   const xsq2 = this.x * x2;
  //   const ysq2 = this.y * y2;
  //   const zsq2 = this.z * z2;

  //   const xy2 = this.x * y2;
  //   const xz2 = this.x * z2;
  //   const yz2 = this.y * z2;

  //   const wx2 = this.w * x2;
  //   const wy2 = this.w * y2;
  //   const wz2 = this.w * z2;

  //   const mat4 = new Mat4();
  //   return mat4.set(
  //     1.0 - (ysq2 + zsq2), xy2 - wz2, xz2 + wy2, 0.0,
  //     xy2 + wz2, 1.0 - (xsq2 + zsq2), yz2 - wx2, 0.0,
  //     xz2 - wy2, yz2 + wx2, 1.0 - (xsq2 + ysq2), 0.0,
  //     0.0, 0.0, 0.0, 1.0
  //   );
  // }

  toMatrix4() {
    const sqw = this.w * this.w;
    const sqx = this.x * this.x;
    const sqy = this.y * this.y;
    const sqz = this.z * this.z;

    // invs (inverse square length) is only required if quaternion is not already normalised
    const invs = 1 / (sqx + sqy + sqz + sqw);
    const m00 = (sqx - sqy - sqz + sqw) * invs; // since sqw + sqx + sqy + sqz =1/invs*invs
    const m11 = (-sqx + sqy - sqz + sqw) * invs;
    const m22 = (-sqx - sqy + sqz + sqw) * invs;

    let tmp1 = this.x * this.y;
    let tmp2 = this.z * this.w;
    const m10 = 2.0 * (tmp1 + tmp2) * invs;
    const m01 = 2.0 * (tmp1 - tmp2) * invs;

    tmp1 = this.x * this.z;
    tmp2 = this.y * this.w;
    const m20 = 2.0 * (tmp1 - tmp2) * invs;
    const m02 = 2.0 * (tmp1 + tmp2) * invs;
    tmp1 = this.y * this.z;
    tmp2 = this.x * this.w;
    const m21 = 2.0 * (tmp1 + tmp2) * invs;
    const m12 = 2.0 * (tmp1 - tmp2) * invs;

    const mat4 = new Mat4();
    return mat4.set(m00, m10, m20, 0.0, m01, m11, m21, 0.0, m02, m12, m22, 0.0, 0.0, 0.0, 0.0, 1.0);
  }

  setFromMat3(mat3) {
    const d = mat3.get();
    const ix = d[0];
    const iy = d[1];
    const iz = d[2];
    const jx = d[3];
    const jy = d[4];
    const jz = d[5];
    const kx = d[6];
    const ky = d[7];
    const kz = d[8];
    this.w = Math.sqrt(Math.max(0.0, 1.0 + ix + jy + kz)) * 0.5;
    this.x = Math.sqrt(Math.max(0.0, 1.0 + ix - jy - kz)) * 0.5;
    this.y = Math.sqrt(Math.max(0.0, 1.0 - ix + jy - kz)) * 0.5;
    this.z = Math.sqrt(Math.max(0.0, 1.0 - ix - jy + kz)) * 0.5;
    this.x *= Math.sign(jz - ky);
    this.y *= Math.sign(kx - iz);
    this.z *= Math.sign(iy - jx);
    return this;
  }

  get() {
    return [this.x, this.y, this.z, this.w];
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getZ() {
    return this.z;
  }

  getW() {
    return this.w;
  }
}

export default Quaternion;
