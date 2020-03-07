import Bullet from '../persos/Bullet';

export default class {
  constructor(constants, sprites, viewBox) {
    this.bullets = [];
    this.isAiming = false;
    this.viewBox = viewBox;
    this.callbackShoot = null;
    this.callbackCollide = null;
    this.sprites = sprites;
    this.constants = constants;
    this.recoil = constants.physics.recoil;
    this.numero = 0;
  }

  update(map, tileSize, startPos, isAiming, goLeft) {
    if (!this.isAiming && isAiming) {
      this.createNewOne(startPos, goLeft, tileSize);
    } else if (this.isAiming && !isAiming) {
      this.shootOne();
    }
    const toDelete = [];
    this.bullets.forEach((bullet, idx) => {
      bullet.update(map, tileSize, startPos, isAiming);
      if (bullet.isCollide()) {
        toDelete.push(idx);
        if (this.callbackCollide) this.callbackCollide(bullet.getId());
      }
    });

    if (toDelete.length > 0) {
      this.bullets = this.bullets.filter(
        (bullet, idx) => toDelete.indexOf(idx) === -1,
      );
    }

    this.isAiming = isAiming;
  }

  createNewOne(startPos, goLeft, tileSize) {
    this.bullets.push(
      new Bullet({
        id: this.constants.id + this.numero,
        constants: this.constants,
        sprites: this.sprites,
        viewBox: this.viewBox,
        tileSize,
        startPos,
        goLeft,
      }),
    );
    this.numero += 1;
  }

  shootOne() {
    if (this.bullets.length > 0) {
      const lastBullet = this.bullets[this.bullets.length - 1];
      lastBullet.shoot(this.constants.states.BULLET);
      if (this.callbackShoot) {
        this.callbackShoot(
          lastBullet.getId(),
          lastBullet.getCollisionBox(),
          this.recoil,
        );
      }
    }
  }

  removeOne(id) {
    this.bullets = this.bullets.filter((bullet) => bullet.getId() !== id);
  }

  render(program, texture, objet) {
    this.bullets.forEach((bullet) => {
      bullet.render(program, texture, objet);
    });
  }

  setCallbackShoot(callback) {
    this.callbackShoot = callback;
  }

  setCallbackCollide(callback) {
    this.callbackCollide = callback;
  }

  get() {
    return this.bullets.map((bullet) => bullet.getPosition());
  }
}
