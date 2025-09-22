import { EPSILON } from '../constants/maths';
import Mat3 from './Mat3';
import Vec3 from './Vec3';

class Mat4 {
  constructor() {
    this.d = new Array(16);
    this.sauvegardePrecedente = [];
    this.empilement = 0;
    this.init();
  }

  init() {
    this.reset();
    this.sauvegardePrecedente = [];
    this.empilement = 0;
    return this;
  }

  reset() {
    for (let i = 0; i < 16; i += 1) {
      this.d[i] = 0.0;
    }
    return this;
  }

  get() {
    return this.d;
  }

  setRaw(d) {
    this.d = d;
    return this;
  }

  set(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4) {
    this.d[0] = a1;
    this.d[1] = a2;
    this.d[2] = a3;
    this.d[3] = a4;

    this.d[4] = b1;
    this.d[5] = b2;
    this.d[6] = b3;
    this.d[7] = b4;

    this.d[8] = c1;
    this.d[9] = c2;
    this.d[10] = c3;
    this.d[11] = c4;

    this.d[12] = d1;
    this.d[13] = d2;
    this.d[14] = d3;
    this.d[15] = d4;
    return this;
  }

  setFromArray(values) {
    return this.set(
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5],
      values[6],
      values[7],
      values[8],
      values[9],
      values[10],
      values[11],
      values[12],
      values[13],
      values[14],
      values[15],
    );
  }

  getMatrice3x3() {
    const mat3 = new Mat3();
    mat3.set(
      this.d[0],
      this.d[1],
      this.d[2],
      this.d[4],
      this.d[5],
      this.d[6],
      this.d[8],
      this.d[9],
      this.d[10],
    );
    return mat3;
  }

  multiplyArray(values) {
    const m = new Mat4();
    m.setFromArray(values);
    return this.multiply(m);
  }

  multiply(matrice) {
    const result = new Mat4();
    for (let k = 0; k < 4; k += 1) {
      for (let j = 0; j < 4; j += 1) {
        for (let i = 0; i < 4; i += 1) {
          result.d[4 * j + k] += this.d[4 * j + i] * matrice.d[4 * i + k];
        }
      }
    }
    this.d = result.d;
    return this;
  }

  equal(matrice2) {
    for (let i = 0; i < 16; i += 1) {
      this.d[i] = matrice2.d[i];
      this.sauvegardePrecedente[i] = matrice2.sauvegardePrecedente[i];
    }
    return this;
  }

  push() {
    this.empilement += 1;
    let cpt = 0;
    for (let i = (this.empilement - 1) * 16; i < this.empilement * 16; i += 1) {
      this.sauvegardePrecedente[i] = this.d[cpt];
      cpt += 1;
    }
    return this;
  }

  pop() {
    if (this.empilement > 0) {
      let cpt = 0;
      for (let i = (this.empilement - 1) * 16; i < this.empilement * 16; i += 1) {
        this.d[cpt] = this.sauvegardePrecedente[i];
        this.sauvegardePrecedente[i] = null;
        cpt += 1;
      }
      this.empilement -= 1;
    } else {
      console.error('pop de trop');
    }
    return this;
  }

  translate(x, y, z) {
    const translation = new Mat4();
    translation.identity();
    translation.d[12] = x;
    translation.d[13] = y;
    translation.d[14] = z;
    this.multiply(translation);
    return this;
  }

  scale(x, y, z) {
    const scale = new Mat4();
    scale.d[0] = x;
    scale.d[5] = y === undefined ? x : y;
    scale.d[10] = z === undefined ? x : z;
    scale.d[15] = 1.0;
    this.multiply(scale);
    return this;
  }

  resetScale() {
    // work if no rotation
    this.d[0] = 1;
    this.d[5] = 1;
    this.d[10] = 1;
    return this;
  }

  resetTranslate() {
    this.d[12] = 0;
    this.d[13] = 0;
    this.d[14] = 0;
    return this;
  }

  rotate(angle, x, y, z) {
    const rotation = new Mat4();
    const angleInRadians = angle * (Math.PI / 180);

    const axe = new Vec3(x, y, z);
    axe.normalise();

    rotation.d[0] = axe.d[0] * axe.d[0] * (1 - Math.cos(angleInRadians)) + Math.cos(angleInRadians);
    rotation.d[1] =
      axe.d[0] * axe.d[1] * (1 - Math.cos(angleInRadians)) - axe.d[2] * Math.sin(angleInRadians);
    rotation.d[2] =
      axe.d[0] * axe.d[2] * (1 - Math.cos(angleInRadians)) + axe.d[1] * Math.sin(angleInRadians);

    rotation.d[4] =
      axe.d[0] * axe.d[1] * (1 - Math.cos(angleInRadians)) + axe.d[2] * Math.sin(angleInRadians);
    rotation.d[5] = axe.d[1] * axe.d[1] * (1 - Math.cos(angleInRadians)) + Math.cos(angleInRadians);
    rotation.d[6] =
      axe.d[1] * axe.d[2] * (1 - Math.cos(angleInRadians)) - axe.d[0] * Math.sin(angleInRadians);

    rotation.d[8] =
      axe.d[0] * axe.d[2] * (1 - Math.cos(angleInRadians)) - axe.d[1] * Math.sin(angleInRadians);
    rotation.d[9] =
      axe.d[1] * axe.d[2] * (1 - Math.cos(angleInRadians)) + axe.d[0] * Math.sin(angleInRadians);
    rotation.d[10] =
      axe.d[2] * axe.d[2] * (1 - Math.cos(angleInRadians)) + Math.cos(angleInRadians);

    rotation.d[15] = 1.0;

    this.multiply(rotation);
    return this;
  }

  identity() {
    this.init();
    this.d[0] = 1.0;
    this.d[5] = 1.0;
    this.d[10] = 1.0;
    this.d[15] = 1.0;
    return this;
  }

  perspective(angle, ratio, near, far) {
    const fieldOfViewYInRadians = angle * (Math.PI / 180);
    const f = 1.0 / Math.tan(fieldOfViewYInRadians / 2);
    const rangeInv = 1 / (near - far);

    this.set(
      f / ratio,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    );
    return this;
  }

  ortho(left, right, bottom, top, near, far) {
    this.set(
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      -2 / (far - near),
      0,
      -(right + left) / (right - left),
      -(top + bottom) / (top - bottom),
      -(far + near) / (far - near),
      1,
    );
    return this;
  }

  lookAt(e0, e1, e2, c0, c1, c2, a0, a1, a2) {
    let x0;
    let x1;
    let x2;
    let y0;
    let y1;
    let y2;
    let z0;
    let z1;
    let z2;
    let len;
    const eyex = e0;
    const eyey = e1;
    const eyez = e2;
    const upx = a0;
    const upy = a1;
    const upz = a2;
    const centerx = c0;
    const centery = c1;
    const centerz = c2;

    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      this.identity();
      return this;
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    this.set(
      x0,
      y0,
      z0,
      0,
      x1,
      y1,
      z1,
      0,
      x2,
      y2,
      z2,
      0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1,
    );
    return this;
  }

  // lookAt(e0, e1, e2, c0, c1, c2, a0, a1, a2) {
  //   const eye = new Vec3(e0, e1, e2);
  //   const cible = new Vec3(c0, c1, c2);
  //   const axe = new Vec3(a0, a1, a2);

  //   const vz = new Vec3();
  //   vz.equal(eye)
  //     .minus(cible)
  //     .normalise();
  //   const vx = new Vec3();
  //   vx.equal(axe.cross(vz)).normalise();
  //   const vy = new Vec3();
  //   vy.equal(vz.cross(vx)).normalise();
  //   this.set(
  //     vx.d[0],
  //     vx.d[1],
  //     vx.d[2],
  //     0,
  //     vy.d[0],
  //     vy.d[1],
  //     vy.d[2],
  //     0,
  //     vz.d[0],
  //     vz.d[1],
  //     vz.d[2],
  //     0,
  //     -vx.dot(eye),
  //     -vy.dot(eye),
  //     -vz.dot(eye),
  //     1
  //   );
  //   return this;
  // }

  transpose() {
    return this.setFromArray(Mat4.transpose(this.d));
  }

  static transpose(array) {
    const ordre = new Float32Array(16);
    let cpt = 0;
    for (let j = 0; j < 4; j += 1) {
      for (let i = 0; i < 4; i += 1) {
        ordre[cpt] = array[i * 4 + j];
        cpt += 1;
      }
    }
    return ordre;
  }

  inverse() {
    // get cofactors of minor matrices
    const cofactor0 = Mat4.getCofacteur(
      this.d[5],
      this.d[6],
      this.d[7],
      this.d[9],
      this.d[10],
      this.d[11],
      this.d[13],
      this.d[14],
      this.d[15],
    );
    const cofactor1 = Mat4.getCofacteur(
      this.d[4],
      this.d[6],
      this.d[7],
      this.d[8],
      this.d[10],
      this.d[11],
      this.d[12],
      this.d[14],
      this.d[15],
    );
    const cofactor2 = Mat4.getCofacteur(
      this.d[4],
      this.d[5],
      this.d[7],
      this.d[8],
      this.d[9],
      this.d[11],
      this.d[12],
      this.d[13],
      this.d[15],
    );
    const cofactor3 = Mat4.getCofacteur(
      this.d[4],
      this.d[5],
      this.d[6],
      this.d[8],
      this.d[9],
      this.d[10],
      this.d[12],
      this.d[13],
      this.d[14],
    );

    // get determinant
    const determinant =
      this.d[0] * cofactor0 - this.d[1] * cofactor1 + this.d[2] * cofactor2 - this.d[3] * cofactor3;

    const cofactor4 = Mat4.getCofacteur(
      this.d[1],
      this.d[2],
      this.d[3],
      this.d[9],
      this.d[10],
      this.d[11],
      this.d[13],
      this.d[14],
      this.d[15],
    );
    const cofactor5 = Mat4.getCofacteur(
      this.d[0],
      this.d[2],
      this.d[3],
      this.d[8],
      this.d[10],
      this.d[11],
      this.d[12],
      this.d[14],
      this.d[15],
    );
    const cofactor6 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[3],
      this.d[8],
      this.d[9],
      this.d[11],
      this.d[12],
      this.d[13],
      this.d[15],
    );
    const cofactor7 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[2],
      this.d[8],
      this.d[9],
      this.d[10],
      this.d[12],
      this.d[13],
      this.d[14],
    );

    const cofactor8 = Mat4.getCofacteur(
      this.d[1],
      this.d[2],
      this.d[3],
      this.d[5],
      this.d[6],
      this.d[7],
      this.d[13],
      this.d[14],
      this.d[15],
    );
    const cofactor9 = Mat4.getCofacteur(
      this.d[0],
      this.d[2],
      this.d[3],
      this.d[4],
      this.d[6],
      this.d[7],
      this.d[12],
      this.d[14],
      this.d[15],
    );
    const cofactor10 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[3],
      this.d[4],
      this.d[5],
      this.d[7],
      this.d[12],
      this.d[13],
      this.d[15],
    );
    const cofactor11 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[2],
      this.d[4],
      this.d[5],
      this.d[6],
      this.d[12],
      this.d[13],
      this.d[14],
    );

    const cofactor12 = Mat4.getCofacteur(
      this.d[1],
      this.d[2],
      this.d[3],
      this.d[5],
      this.d[6],
      this.d[7],
      this.d[9],
      this.d[10],
      this.d[11],
    );
    const cofactor13 = Mat4.getCofacteur(
      this.d[0],
      this.d[2],
      this.d[3],
      this.d[4],
      this.d[6],
      this.d[7],
      this.d[8],
      this.d[10],
      this.d[11],
    );
    const cofactor14 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[3],
      this.d[4],
      this.d[5],
      this.d[7],
      this.d[8],
      this.d[9],
      this.d[11],
    );
    const cofactor15 = Mat4.getCofacteur(
      this.d[0],
      this.d[1],
      this.d[2],
      this.d[4],
      this.d[5],
      this.d[6],
      this.d[8],
      this.d[9],
      this.d[10],
    );

    const invDeterminant = 1.0 / determinant;

    this.d[0] = invDeterminant * cofactor0;
    this.d[1] = -invDeterminant * cofactor4;
    this.d[2] = invDeterminant * cofactor8;
    this.d[3] = -invDeterminant * cofactor12;

    this.d[4] = -invDeterminant * cofactor1;
    this.d[5] = invDeterminant * cofactor5;
    this.d[6] = -invDeterminant * cofactor9;
    this.d[7] = invDeterminant * cofactor13;

    this.d[8] = invDeterminant * cofactor2;
    this.d[9] = -invDeterminant * cofactor6;
    this.d[10] = invDeterminant * cofactor10;
    this.d[11] = -invDeterminant * cofactor14;

    this.d[12] = -invDeterminant * cofactor3;
    this.d[13] = invDeterminant * cofactor7;
    this.d[14] = -invDeterminant * cofactor11;
    this.d[15] = invDeterminant * cofactor15;
    return this;
  }

  getDeterminant() {
    return (
      this.d[0] *
        Mat4.getCofacteur(
          this.d[5],
          this.d[6],
          this.d[7],
          this.d[9],
          this.d[10],
          this.d[11],
          this.d[13],
          this.d[14],
          this.d[15],
        ) -
      this.d[1] *
        Mat4.getCofacteur(
          this.d[4],
          this.d[6],
          this.d[7],
          this.d[8],
          this.d[10],
          this.d[11],
          this.d[12],
          this.d[14],
          this.d[15],
        ) +
      this.d[2] *
        Mat4.getCofacteur(
          this.d[4],
          this.d[5],
          this.d[7],
          this.d[8],
          this.d[9],
          this.d[11],
          this.d[12],
          this.d[13],
          this.d[15],
        ) -
      this.d[3] *
        Mat4.getCofacteur(
          this.d[4],
          this.d[5],
          this.d[6],
          this.d[8],
          this.d[9],
          this.d[10],
          this.d[12],
          this.d[13],
          this.d[14],
        )
    );
  }

  static getCofacteur(m0, m1, m2, m3, m4, m5, m6, m7, m8) {
    return m0 * (m4 * m8 - m5 * m7) - m1 * (m3 * m8 - m5 * m6) + m2 * (m3 * m7 - m4 * m6);
  }
}

export default Mat4;
