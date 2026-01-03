import { fract, signe } from "../numbers";
import type Mat3 from "./Mat3";

class Vec3 {
  d: [number, number, number];

  constructor(x = 0, y = 0, z = 0) {
    this.d = [0, 0, 0];
    this.set(x, y, z);
  }

  normalise() {
    const length = this.length();
    if (length !== 0) {
      this.d[0] /= length;
      this.d[1] /= length;
      this.d[2] /= length;
    }
    return this;
  }

  get() {
    return this.d;
  }

  getX() {
    return this.d[0];
  }

  get x(): number {
    return this.d[0];
  }

  set x(v: number) {
    this.d[0] = v;
  }

  getY() {
    return this.d[1];
  }

  get y(): number {
    return this.d[1];
  }

  set y(v: number) {
    this.d[1] = v;
  }

  getZ() {
    return this.d[2];
  }

  get z(): number {
    return this.d[2];
  }

  set z(v: number) {
    this.d[2] = v;
  }

  set(x: number | null, y: number | null, z: number | null) {
    if (x !== null) {
      this.d[0] = x;
    }
    if (y !== null) {
      this.d[1] = y;
    } else if (x !== null) {
      this.d[1] = x;
    }
    if (z !== null) {
      this.d[2] = z;
    } else if (x !== null) {
      this.d[2] = x;
    }
    return this;
  }

  setX(value: number) {
    this.d[0] = value;
  }

  setY(value: number) {
    this.d[1] = value;
  }

  setZ(value: number) {
    this.d[2] = value;
  }

  addXYZ(x: number, y: number, z: number) {
    this.d[0] += x;
    this.d[1] += y;
    this.d[2] += z;
    return this;
  }

  addX(value: number) {
    this.d[0] += value;
    return this;
  }

  addY(value: number) {
    this.d[1] += value;
    return this;
  }

  addZ(value: number) {
    this.d[2] += value;
    return this;
  }

  multiplyX(value: number) {
    this.d[0] *= value;
    return this;
  }

  multiplyY(value: number) {
    this.d[1] *= value;
    return this;
  }

  multiplyZ(value: number) {
    this.d[2] *= value;
    return this;
  }

  limiter(max: number) {
    const lengthCarre = this.d[0] * this.d[0] + this.d[1] * this.d[1] + this.d[2] * this.d[2];
    if (lengthCarre > max * max && lengthCarre > 0) {
      const ratio = max / Math.sqrt(lengthCarre);
      this.d[0] *= ratio;
      this.d[1] *= ratio;
      this.d[2] *= ratio;
    }
    return this;
  }

  // produit vectoriel
  cross(v: Vec3) {
    return new Vec3(
      this.d[1] * v.d[2] - this.d[2] * v.d[1],
      this.d[2] * v.d[0] - this.d[0] * v.d[2],
      this.d[0] * v.d[1] - this.d[1] * v.d[0],
    );
  }

  // produit scalaire
  dot(v: Vec3) {
    return this.d[0] * v.d[0] + this.d[1] * v.d[1] + this.d[2] * v.d[2];
  }

  length() {
    return Math.sqrt(this.d[0] * this.d[0] + this.d[1] * this.d[1] + this.d[2] * this.d[2]);
  }

  directionVers(v: Vec3) {
    this.d[0] = v.d[0] - this.d[0];
    this.d[1] = v.d[1] - this.d[1];
    this.d[2] = v.d[2] - this.d[2];
    return this;
  }

  equal(v: Vec3) {
    this.d = [v.d[0], v.d[1], v.d[2]];
    return this;
  }

  add(v: Vec3) {
    this.d[0] += v.d[0];
    this.d[1] += v.d[1];
    this.d[2] += v.d[2];
    return this;
  }

  addNumber(valeur: number) {
    this.d[0] += valeur;
    this.d[1] += valeur;
    this.d[2] += valeur;
    return this;
  }

  minus(v: Vec3) {
    this.d[0] -= v.d[0];
    this.d[1] -= v.d[1];
    this.d[2] -= v.d[2];
    return this;
  }

  minusNumber(valeur: number) {
    this.d[0] -= valeur;
    this.d[1] -= valeur;
    this.d[2] -= valeur;
    return this;
  }

  multiplyNumber(valeur: number) {
    this.d[0] *= valeur;
    this.d[1] *= valeur;
    this.d[2] *= valeur;
    return this;
  }

  multiplyMatrix(matrice: Mat3) {
    // maybe wrong
    // this.set(
    //   matrice.d[0] * this.d[0] +
    //     matrice.d[1] * this.d[1] +
    //     matrice.d[2] * this.d[2],
    //   matrice.d[3] * this.d[0] +
    //     matrice.d[4] * this.d[1] +
    //     matrice.d[5] * this.d[2],
    //   matrice.d[6] * this.d[0] +
    //     matrice.d[7] * this.d[1] +
    //     matrice.d[8] * this.d[2],
    // );
    const m = matrice.d ? matrice : { d: matrice }; // accept Mat4 or raw array
    const x = this.d[0];
    const y = this.d[1];
    const z = this.d[2];

    const outX = m.d[0] * x + m.d[4] * y + m.d[8] * z + m.d[12];
    const outY = m.d[1] * x + m.d[5] * y + m.d[9] * z + m.d[13];
    const outZ = m.d[2] * x + m.d[6] * y + m.d[10] * z + m.d[14];
    const outW = m.d[3] * x + m.d[7] * y + m.d[11] * z + m.d[15];

    if (outW !== 0 && outW !== 1) {
      this.set(outX / outW, outY / outW, outZ / outW);
    } else {
      this.set(outX, outY, outZ);
    }
    return this;
  }

  multiply(v: Vec3) {
    this.d[0] *= v.d[0];
    this.d[1] *= v.d[1];
    this.d[2] *= v.d[2];
    return this;
  }

  divideNumber(valeur: number) {
    this.d[0] /= valeur;
    this.d[1] /= valeur;
    this.d[2] /= valeur;
    return this;
  }

  divide(v: Vec3) {
    this.d[0] /= v.d[0];
    this.d[1] /= v.d[1];
    this.d[2] /= v.d[2];
    return this;
  }

  fract() {
    this.d[0] = fract(this.d[0]);
    this.d[1] = fract(this.d[1]);
    this.d[2] = fract(this.d[2]);
    return this;
  }

  distance(v: Vec3) {
    return Math.sqrt(
      (v.d[0] - this.d[0]) * (v.d[0] - this.d[0]) +
        (v.d[1] - this.d[1]) * (v.d[1] - this.d[1]) +
        (v.d[2] - this.d[2]) * (v.d[2] - this.d[2]),
    );
  }

  angleDegree(v: Vec3) {
    const cosAngle = this.dot(v) / (this.length() * v.length());
    const angleRadian = Math.acos(cosAngle);
    const angle = (angleRadian * 180) / Math.PI;
    const sens = signe(this.d[0] * v.d[1] + this.d[1] * v.d[0]); // sens de l'angle
    return angle * -sens;
  }

  computeNormal(v2: Vec3, v3: Vec3, sens: boolean) {
    const result = new Vec3();
    const U = new Vec3();
    const V = new Vec3();
    U.equal(v2.minus(this));
    V.equal(v3.minus(this));
    if (sens) {
      // inverser le produit vectoriel pour inverser la normale
      result.equal(V.cross(U));
    } else {
      result.equal(U.cross(V));
    }
    result.normalise();
    return result;
  }

  static getBarycentre(v1: Vec3, v2: Vec3, v3: Vec3, pos: [number, number]) {
    const det =
      (v2.d[2] - v3.d[2]) * (v1.d[0] - v3.d[0]) + (v3.d[0] - v2.d[0]) * (v1.d[2] - v3.d[2]);
    const l1 =
      ((v2.d[2] - v3.d[2]) * (pos[0] - v3.d[0]) + (v3.d[0] - v2.d[0]) * (pos[1] - v3.d[2])) / det;
    const l2 =
      ((v3.d[2] - v1.d[2]) * (pos[0] - v3.d[0]) + (v1.d[0] - v3.d[0]) * (pos[1] - v3.d[2])) / det;
    const l3 = 1.0 - l1 - l2;
    return l1 * v1.d[1] + l2 * v2.d[1] + l3 * v3.d[1];
  }

  static lerp(a: Vec3, b: Vec3, t: number) {
    const ax = a.d[0];
    const ay = a.d[1];
    const az = a.d[2];
    const x = ax + t * (b.d[0] - ax);
    const y = ay + t * (b.d[1] - ay);
    const z = az + t * (b.d[2] - az);
    return new Vec3(x, y, z);
  }
}

export default Vec3;
