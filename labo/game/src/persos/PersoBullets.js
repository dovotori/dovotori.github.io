import Vec3 from "../../../lib/utils/maths/Vec3";
import Bullets from "../game/Bullets";
import Perso from "./PersoFxs";

export default class PersoBullets extends Perso {
  constructor({ constants, sprites, viewBox, fxs, bullets }) {
    super({ constants, sprites, viewBox, fxs });

    this.offsetAiming = this.getAimingOffsetVector();
    this.aimingPos = new Vec3();

    if (bullets) {
      const finalId = `${constants.id}-${bullets.constants.id}`;
      this.bullets = new Bullets({ ...bullets.constants, id: finalId }, bullets.sprites, viewBox);

      this.bullets.setCallbackShoot(this.callbackBulletShoot);
      this.bullets.setCallbackCollide(this.callbackBulletCollide);
    }
  }

  update(map, tileSize) {
    super.update(map, tileSize);

    this.aimingPos.equal(this.behavior.getPosition());
    this.aimingPos.addX(this.inverseX ? this.offsetAiming.invX : this.offsetAiming.x);
    this.aimingPos.addY(this.offsetAiming.y);

    if (this.bullets) {
      this.bullets.update(map, tileSize, this.aimingPos, this.isAiming(), this.inverseX);
    }
  }

  renderBullets(prog, tex, obj) {
    this.bullets.render(prog, tex, obj);
  }

  callbackBulletShoot = (_id, collisionBox, recoil) => {
    this.setRecoil(recoil);
    this.collisionCallback.addBoxes([collisionBox]);
  };

  callbackBulletCollide = (id) => {
    this.collisionCallback.removeBox(id);
  };

  setRecoil = (recoil) => {
    this.behavior.addToSpeed(new Vec3(this.inverseX ? recoil : -recoil, 0, 0));
  };

  getAimingOffsetVector() {
    const { refSize } = this.sprites;
    const { w, cx, cy } = this.sprites[this.constants.states.AIM].uv[0];
    return {
      x: cx / refSize,
      y: cy / refSize,
      invX: (w - cx) / refSize,
    };
  }

  getAimingPos() {
    return this.aimingPos;
  }

  getAimingPosition() {
    const { h } = this.stateSprite.getRelSize();
    return new Vec3(
      this.behavior.getX() -
        this.viewBox.x +
        (this.inverseX ? this.offsetAiming.invX : this.offsetAiming.x),
      this.behavior.getY() - this.viewBox.y - h + this.offsetAiming.y,
      this.behavior.getZ(),
    );
  }

  isAiming() {
    return this.behavior.isAiming();
  }

  removeBullet = (bulletId) => {
    this.bullets.removeOne(bulletId);
  };
}
