import Vec3 from '../maths/Vec3';

const SIZE = 2;
const DAMPING = 0.01; // amortissement, ralentissement entre 0 et 0.99999
const MIN_X = 0;
const MIN_Y = 0;
const MIN_Z = 0;
const MAX_X = 500;
const MAX_Y = 500;
const MAX_Z = 500;

export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0);
    this.vitesse = new Vec3(0, 0, 0);
  }

  updateLinear = (lockX, lockY, lockZ) => {
    // ACCELERATION AVEC VITESSE ET RALENTISSEMENT PROGRESSIF
    if (!lockX) {
      this.position.x += this.vitesse.x;
    }
    if (!lockY) {
      this.position.y += this.vitesse.y;
    }
    if (!lockZ) {
      this.position.z += this.vitesse.z;
    }

    if (this.position.x < MIN_X) {
      this.position.x = MIN_X - (this.position.x - MIN_X);
      this.vitesse.x *= -1;
    }

    if (this.position.x > MAX_X) {
      this.position.x = MAX_X - (this.position.x - MAX_X);
      this.vitesse.x *= -1;
    }

    if (this.position.y < MIN_Y) {
      this.position.y = MIN_Y - (this.position.y - MIN_Y);
      this.vitesse.y *= -1;
    }

    if (this.position.y > MAX_Y) {
      this.position.y = MAX_Y - (this.position.y - MAX_Y);
      this.vitesse.y *= -1;
    }

    if (this.position.z < MIN_Z) {
      this.position.z = MIN_Z - (this.position.z - MIN_Z);
      this.vitesse.z *= -1;
    }

    if (this.position.z > MAX_Z) {
      this.position.z = MAX_Z - (this.position.z - MAX_Z);
      this.vitesse.z *= -1;
    }

    // ralentissement du node
    this.vitesse = this.vitesse.multiplyNumber(DAMPING);
  };

  update = () => {
    this.position.x += this.vitesse.x;
    this.position.y += this.vitesse.y;
    this.position.z += this.vitesse.z;
  };

  rebond = () => {
    if (this.position.x < MIN_X) {
      this.vitesse.x *= -1;
    }
    if (this.position.x > MAX_X) {
      this.vitesse.x *= -1;
    }
    if (this.position.y < MIN_Y) {
      this.vitesse.y *= -1;
    }
    if (this.position.y > MAX_Y) {
      this.vitesse.y *= -1;
    }
    if (this.position.z < MIN_Z) {
      this.vitesse.z *= -1;
    }
    if (this.position.z > MAX_Z) {
      this.vitesse.z *= -1;
    }
  };

  respawnBordures = () => {
    if (this.position.x < -SIZE) {
      this.position.x = MAX_X + SIZE;
    }
    if (this.position.y < -SIZE) {
      this.position.y = MAX_Y + SIZE;
    }
    if (this.position.z < -SIZE) {
      this.position.z = MAX_Z + SIZE;
    }

    if (this.position.x > MAX_X + SIZE) {
      this.position.x = -SIZE;
    }
    if (this.position.y > MAX_Y + SIZE) {
      this.position.y = -SIZE;
    }
    if (this.position.z > MAX_Z + SIZE) {
      this.position.z = -SIZE;
    }
  };

  setPosition = (x, y, z) => {
    this.position.set(x, y, z);
  };

  setSpeed = (x, y, z) => {
    this.vitesse.set(x, y, z);
  };

  getPosition = () => {
    return this.position;
  };

  getSpeed = () => {
    return this.vitesse;
  };
}
