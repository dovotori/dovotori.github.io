import Vec3 from "./Vec3";

type Mat3Array = [number, number, number, number, number, number, number, number, number];
class Mat3 {
  d: Mat3Array;
  sauvegardePrecedente: Mat3Array;
  empilement: number;

  constructor() {
    this.init();
  }

  init() {
    this.d = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.sauvegardePrecedente = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.empilement = 0;
    return this;
  }

  get() {
    return this.d;
  }

  set(
    a1: number,
    a2: number,
    a3: number,
    b1: number,
    b2: number,
    b3: number,
    c1: number,
    c2: number,
    c3: number,
  ) {
    this.d[0] = a1;
    this.d[1] = a2;
    this.d[2] = a3;

    this.d[3] = b1;
    this.d[4] = b2;
    this.d[5] = b3;

    this.d[6] = c1;
    this.d[7] = c2;
    this.d[8] = c3;
    return this;
  }

  setFromArray(values: Mat3Array) {
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
    );
  }

  // ////////////////////OPERATIONS//////////////////////

  multiply(matrice2: Mat3) {
    const result = new Mat3();
    for (let k = 0; k < 3; k += 1) {
      for (let j = 0; j < 3; j += 1) {
        for (let i = 0; i < 3; i += 1) {
          result.d[3 * j + k] += this.d[3 * j + i] * matrice2.d[3 * i + k];
        }
      }
    }

    for (let i = 0; i < 9; i += 1) {
      this.d[i] = result.d[i];
    }
    return this;
  }

  equal(matrice2: Mat3) {
    for (let i = 0; i < 9; i += 1) {
      this.d[i] = matrice2.d[i];
      this.sauvegardePrecedente[i] = matrice2.sauvegardePrecedente[i];
    }
    return this;
  }

  // //////////////////// IMBRICATION //////////////////////

  push() {
    this.empilement += 1;
    let cpt = 0;
    for (let i = (this.empilement - 1) * 9; i < this.empilement * 9; i += 1) {
      this.sauvegardePrecedente[i] = this.d[cpt];
      cpt += 1;
    }
    return this;
  }

  pop() {
    if (this.empilement > 0) {
      let cpt = 0;
      for (let i = (this.empilement - 1) * 9; i < this.empilement * 9; i += 1) {
        this.d[cpt] = this.sauvegardePrecedente[i];
        this.sauvegardePrecedente[i] = null;
        cpt += 1;
      }
      this.empilement -= 1;
    } else {
      console.error("pop de trop");
    }
    return this;
  }

  // //////////////////// MODIFICATIONS //////////////////////

  identity() {
    this.init();
    this.d[0] = 1.0;
    this.d[4] = 1.0;
    this.d[8] = 1.0;
    return this;
  }

  transpose() {
    return this.setFromArray(Mat3.transpose(this.d));
  }

  static transpose(array: Mat3Array) {
    const ordre: Mat3Array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cpt = 0;
    for (let j = 0; j < 3; j += 1) {
      for (let i = 0; i < 3; i += 1) {
        ordre[cpt] = array[i * 3 + j];
        cpt += 1;
      }
    }
    return ordre;
  }

  inverse() {
    const copie = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const det = this.getDeterminant();

    if (det === 0) {
      this.identity();
      console.error("Inversement impossible de la matrice");
      return null;
    }

    copie[0] = this.d[4] * this.d[8] - (this.d[5] * this.d[7]) / det;
    copie[1] = -(this.d[1] * this.d[8] - this.d[7] * this.d[2]) / det;
    copie[2] = this.d[1] * this.d[5] - (this.d[4] * this.d[2]) / det;

    copie[3] = -(this.d[3] * this.d[8] - this.d[5] * this.d[6]) / det;
    copie[4] = this.d[0] * this.d[8] - (this.d[6] * this.d[2]) / det;
    copie[5] = -(this.d[0] * this.d[5] - this.d[3] * this.d[2]) / det;

    copie[6] = this.d[3] * this.d[7] - (this.d[6] * this.d[4]) / det;
    copie[7] = -(this.d[0] * this.d[7] - this.d[6] * this.d[1]) / det;
    copie[8] = this.d[0] * this.d[4] - (this.d[1] * this.d[3]) / det;

    for (let i = 0; i < 9; i += 1) {
      this.d[i] = copie[i];
    }
    return this;
  }

  getDeterminant() {
    return (
      this.d[0] * (this.d[4] * this.d[8] - this.d[7] * this.d[5]) +
      this.d[1] * (this.d[5] * this.d[6] - this.d[3] * this.d[8]) +
      this.d[2] * (this.d[3] * this.d[7] - this.d[6] * this.d[4])
    );
  }

  rotate(angle: number, x: number, y: number, z: number) {
    const rotation = new Mat3();
    const newAngle = angle * (Math.PI / 180);

    const axe = new Vec3(x, y, z);
    axe.normalise();

    rotation.d[0] = axe.x * axe.x * (1 - Math.cos(newAngle)) + Math.cos(newAngle);
    rotation.d[1] = axe.x * axe.y * (1 - Math.cos(newAngle)) - axe.z * Math.sin(newAngle);
    rotation.d[2] = axe.x * axe.z * (1 - Math.cos(newAngle)) + axe.y * Math.sin(newAngle);

    rotation.d[3] = axe.x * axe.y * (1 - Math.cos(newAngle)) + axe.z * Math.sin(newAngle);
    rotation.d[4] = axe.y * axe.y * (1 - Math.cos(newAngle)) + Math.cos(newAngle);
    rotation.d[5] = axe.y * axe.z * (1 - Math.cos(newAngle)) - axe.x * Math.sin(newAngle);

    rotation.d[6] = axe.x * axe.z * (1 - Math.cos(newAngle)) - axe.y * Math.sin(newAngle);
    rotation.d[7] = axe.y * axe.z * (1 - Math.cos(newAngle)) + axe.x * Math.sin(newAngle);
    rotation.d[8] = axe.z * axe.z * (1 - Math.cos(newAngle)) + Math.cos(newAngle);

    this.multiply(rotation);
    return this;
  }
}

export default Mat3;
