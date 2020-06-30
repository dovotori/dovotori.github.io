import PersoCollision from './PersoCollision';
import Behavior from '../behaviors/BehaviorBullet';

export default class extends PersoCollision {
  constructor({ constants, sprites, viewBox, tileSize, startPos, goLeft }) {
    super({
      constants,
      sprites,
      viewBox,
    });
    this.behavior = new Behavior(constants, null, tileSize, startPos, goLeft);
    this.inverseX = goLeft;
    this.startPos = startPos;
    this.isShooted = false;
  }

  update(map, tileSize, startPos, strength) {
    if (!this.isShooted) {
      this.setAimingStrength(strength);
    }
    this.behavior.setStartPos(startPos);
    super.update(map, tileSize);
  }

  shoot(state) {
    this.isShooted = true;
    this.stateSprite.set(state);
    this.setAimingStrength(1);
    this.behavior.shoot();
  }

  isCollide() {
    return this.behavior.getCollisionAxeX();
  }

  setAimingStrength(value) {
    this.stateSprite.setScale(value);
  }
}
