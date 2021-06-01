import { signe, fract } from '../utils/numbers';

class Vec3 {
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

  getY() {
    return this.d[1];
  }

  getZ() {
    return this.d[2];
  }

  set(x, y, z) {
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

  setX(value) {
    this.d[0] = value;
  }

  setY(value) {
    this.d[1] = value;
  }

  setZ(value) {
    this.d[2] = value;
  }

  addXYZ(x, y, z) {
    this.d[0] += x;
    this.d[1] += y;
    this.d[2] += z;
    return this;
  }

  addX(value) {
    this.d[0] += value;
    return this;
  }

  addY(value) {
    this.d[1] += value;
    return this;
  }

  addZ(value) {
    this.d[2] += value;
    return this;
  }

  multiplyX(value) {
    this.d[0] *= value;
    return this;
  }

  multiplyY(value) {
    this.d[1] *= value;
    return this;
  }

  multiplyZ(value) {
    this.d[2] *= value;
    return this;
  }

  limiter(max) {
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
  cross(v) {
    return new Vec3(
      this.d[1] * v.d[2] - this.d[2] * v.d[1],
      this.d[2] * v.d[0] - this.d[0] * v.d[2],
      this.d[0] * v.d[1] - this.d[1] * v.d[0]
    );
  }

  // produit scalaire
  dot(v) {
    return this.d[0] * v.d[0] + this.d[1] * v.d[1] + this.d[2] * v.d[2];
  }

  length() {
    return Math.sqrt(this.d[0] * this.d[0] + this.d[1] * this.d[1] + this.d[2] * this.d[2]);
  }

  directionVers(v) {
    this.d[0] = v.d[0] - this.d[0];
    this.d[1] = v.d[1] - this.d[1];
    this.d[2] = v.d[2] - this.d[2];
    return this;
  }

  equal(v) {
    this.d = [v.d[0], v.d[1], v.d[2]];
    return this;
  }

  add(v) {
    this.d[0] += v.d[0];
    this.d[1] += v.d[1];
    this.d[2] += v.d[2];
    return this;
  }

  addNumber(valeur) {
    this.d[0] += valeur;
    this.d[1] += valeur;
    this.d[2] += valeur;
    return this;
  }

  minus(v) {
    this.d[0] -= v.d[0];
    this.d[1] -= v.d[1];
    this.d[2] -= v.d[2];
    return this;
  }

  minusNumber(valeur) {
    this.d[0] -= valeur;
    this.d[1] -= valeur;
    this.d[2] -= valeur;
    return this;
  }

  multiplyNumber(valeur) {
    this.d[0] *= valeur;
    this.d[1] *= valeur;
    this.d[2] *= valeur;
    return this;
  }

  multiplyMatrix(matrice) {
    // maybe wrong
    this.set(
      matrice.d[0] * this.d[0] + matrice.d[1] * this.d[1] + matrice.d[2] * this.d[2],
      matrice.d[3] * this.d[0] + matrice.d[4] * this.d[1] + matrice.d[5] * this.d[2],
      matrice.d[6] * this.d[0] + matrice.d[7] * this.d[1] + matrice.d[8] * this.d[2]
    );
    return this;
  }

  multiply(v) {
    this.d[0] *= v.d[0];
    this.d[1] *= v.d[1];
    this.d[2] *= v.d[2];
    return this;
  }

  divideNumber(valeur) {
    this.d[0] /= valeur;
    this.d[1] /= valeur;
    this.d[2] /= valeur;
    return this;
  }

  divide(v) {
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

  distance(v) {
    return Math.sqrt(
      (v.d[0] - this.d[0]) * (v.d[0] - this.d[0]) +
        (v.d[1] - this.d[1]) * (v.d[1] - this.d[1]) +
        (v.d[2] - this.d[2]) * (v.d[2] - this.d[2])
    );
  }

  angleDegree(v) {
    const cosAngle = this.dot(v) / (this.length() * v.length());
    const angleRadian = Math.acos(cosAngle);
    const angle = (angleRadian * 180) / Math.PI;
    const sens = signe(this.d[0] * v.d[1] + this.d[1] * v.d[0]); // sens de l'angle
    return angle * -sens;
  }

  computeNormal(v2, v3, sens) {
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

  static getBarycentre(v1, v2, v3, pos) {
    const det =
      (v2.d[2] - v3.d[2]) * (v1.d[0] - v3.d[0]) + (v3.d[0] - v2.d[0]) * (v1.d[2] - v3.d[2]);
    const l1 =
      ((v2.d[2] - v3.d[2]) * (pos[0] - v3.d[0]) + (v3.d[0] - v2.d[0]) * (pos[1] - v3.d[2])) / det;
    const l2 =
      ((v3.d[2] - v1.d[2]) * (pos[0] - v3.d[0]) + (v1.d[0] - v3.d[0]) * (pos[1] - v3.d[2])) / det;
    const l3 = 1.0 - l1 - l2;
    return l1 * v1.d[1] + l2 * v2.d[1] + l3 * v3.d[1];
  }

  static lerp(a, b, t) {
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
