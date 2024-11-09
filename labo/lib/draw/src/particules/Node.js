import Vec3 from "../maths/Vec3";

const MIN_X = -1;
const MIN_Y = -1;
const MIN_Z = -1;
const MAX_X = 1;
const MAX_Y = 1;
const MAX_Z = 1;

export default class {
  constructor(options = {}) {
    this.position = new Vec3(0, 0, 0);
    this.speed = new Vec3(0, 0, 0);
    this.withRebond = !!options.withRebond;
    this.withSlowDown = !!options.withSlowDown;
    this.withRespawn = !!options.withRespawn;
    this.damping = options.damping || 0.9; // amortissement, ralentissement entre 0 et 0.99999
  }

  // updateLinear = (lockX, lockY, lockZ) => {
  //   // ACCELERATION AVEC VITESSE ET RALENTISSEMENT PROGRESSIF
  //   if (!lockX) {
  //     this.position.x += this.speed.x;
  //   }
  //   if (!lockY) {
  //     this.position.y += this.speed.y;
  //   }
  //   if (!lockZ) {
  //     this.position.z += this.speed.z;
  //   }

  //   if (this.position.x < MIN_X) {
  //     this.position.x = MIN_X - (this.position.x - MIN_X);
  //     this.speed.x *= -1;
  //   }

  //   if (this.position.x > MAX_X) {
  //     this.position.x = MAX_X - (this.position.x - MAX_X);
  //     this.speed.x *= -1;
  //   }

  //   if (this.position.y < MIN_Y) {
  //     this.position.y = MIN_Y - (this.position.y - MIN_Y);
  //     this.speed.y *= -1;
  //   }

  //   if (this.position.y > MAX_Y) {
  //     this.position.y = MAX_Y - (this.position.y - MAX_Y);
  //     this.speed.y *= -1;
  //   }

  //   if (this.position.z < MIN_Z) {
  //     this.position.z = MIN_Z - (this.position.z - MIN_Z);
  //     this.speed.z *= -1;
  //   }

  //   if (this.position.z > MAX_Z) {
  //     this.position.z = MAX_Z - (this.position.z - MAX_Z);
  //     this.speed.z *= -1;
  //   }

  //   // ralentissement du node
  //   this.speed = this.speed.multiplyNumber(DAMPING);
  // };

  update = () => {
    if (this.withSlowDown) {
      this.slowDown();
    }
    if (this.withRebond) {
      this.rebond();
    } else if (this.withRespawn) {
      this.respawn();
    }
    this.position.add(this.speed);
  };

  slowDown = () => {
    this.speed.multiplyNumber(this.damping);
  };

  rebond = () => {
    if (this.position.getX() < MIN_X || this.position.getX() > MAX_X) {
      this.speed.multiplyX(-1);
    }
    if (this.position.getY() < MIN_Y || this.position.getY() > MAX_Y) {
      this.speed.multiplyY(-1);
    }
    if (this.position.getZ() < MIN_Z || this.position.getZ() > MAX_Z) {
      this.speed.multiplyZ(-1);
    }
  };

  respawn = () => {
    if (this.position.getX() < MIN_X) {
      this.position.setX(MAX_X);
    } else if (this.position.getX() > MAX_X) {
      this.position.setX(MIN_X);
    }
    if (this.position.getY() < MIN_Y) {
      this.position.setY(MAX_Y);
    } else if (this.position.getY() > MAX_Y) {
      this.position.setY(MIN_Y);
    }
    if (this.position.getZ() < MIN_Z) {
      this.position.setZ(MAX_Z);
    } else if (this.position.getZ() > MAX_Z) {
      this.position.setZ(MIN_Z);
    }
  };

  setPosition = (x, y, z) => {
    this.position.set(x, y, z);
  };

  setSpeed = (x, y, z) => {
    this.speed.set(x, y, z);
  };

  getPosition = () => this.position;

  getSpeed = () => this.speed;
}
