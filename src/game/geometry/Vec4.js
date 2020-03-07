class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.d = [0, 0, 0, 0];
    this.set(x, y, z, w);
  }

  normalise() {
    const length = this.length();
    if (length !== 0) {
      this.d[0] /= length;
      this.d[1] /= length;
      this.d[2] /= length;
      this.d[3] /= length;
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

  getW() {
    return this.d[3];
  }

  length() {
    return Math.sqrt(
      this.d[0] * this.d[0]
        + this.d[1] * this.d[1]
        + this.d[2] * this.d[2]
        + this.d[3] * this.d[3],
    );
  }

  // ////////////////// OPERATOR ///////////////////////

  set(x, y, z, w) {
    if (x != null) {
      this.d[0] = x;
    }
    if (y != null) {
      this.d[1] = y;
    } else if (x != null) {
      this.d[1] = x;
    }
    if (z != null) {
      this.d[2] = z;
    } else if (x != null) {
      this.d[2] = x;
    }
    if (w != null) {
      this.d[3] = w;
    } else if (x != null) {
      this.d[3] = x;
    }
    return this;
  }

  equal(v) {
    this.d = [v.d[0], v.d[1], v.d[2], v.d[3]];
    return this;
  }

  add(v) {
    this.d[0] += v.d[0];
    this.d[1] += v.d[1];
    this.d[2] += v.d[2];
    this.d[3] += v.d[3];
    return this;
  }

  addNumber(valeur) {
    this.d[0] += valeur;
    this.d[1] += valeur;
    this.d[2] += valeur;
    this.d[3] += valeur;
    return this;
  }

  minus(v) {
    this.d[0] -= v.d[0];
    this.d[1] -= v.d[1];
    this.d[2] -= v.d[2];
    this.d[3] -= v.d[3];
    return this;
  }

  minusNumber(valeur) {
    this.d[0] -= valeur;
    this.d[1] -= valeur;
    this.d[2] -= valeur;
    this.d[3] -= valeur;
    return this;
  }

  multiplyNumber(valeur) {
    this.d[0] *= valeur;
    this.d[1] *= valeur;
    this.d[2] *= valeur;
    this.d[3] *= valeur;
    return this;
  }

  multiplyMatrix(m) {
    const x = this.d[0];
    const y = this.d[1];
    const z = this.d[2];
    const w = this.d[3];
    this.d[0] = m.d[0] * x + m.d[4] * y + m.d[8] * z + m.d[12] * w;
    this.d[1] = m.d[1] * x + m.d[5] * y + m.d[9] * z + m.d[13] * w;
    this.d[2] = m.d[2] * x + m.d[6] * y + m.d[10] * z + m.d[14] * w;
    this.d[3] = m.d[3] * x + m.d[7] * y + m.d[11] * z + m.d[15] * w;
    return this;
  }

  multiply(v) {
    this.d[0] *= v.d[0];
    this.d[1] *= v.d[1];
    this.d[2] *= v.d[2];
    this.d[3] *= v.d[3];
    return this;
  }

  divideNumber(valeur) {
    this.d[0] /= valeur;
    this.d[1] /= valeur;
    this.d[2] /= valeur;
    this.d[3] /= valeur;
    return this;
  }

  divide(v) {
    this.d[0] /= v.d[0];
    this.d[1] /= v.d[1];
    this.d[2] /= v.d[2];
    this.d[3] /= v.d[3];
    return this;
  }

  distance(vec) {
    return Math.sqrt(
      (vec.d[0] - this.d[0]) * (vec.d[0] - this.d[0])
        + (vec.d[1] - this.d[1]) * (vec.d[1] - this.d[1])
        + (vec.d[2] - this.d[2]) * (vec.d[2] - this.d[2])
        + (vec.d[3] - this.d[3]) * (vec.d[3] - this.d[3]),
    );
  }
}

export default Vec4;
