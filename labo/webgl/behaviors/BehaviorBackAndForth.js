import Behavior from './BehaviorGravity';

export default class extends Behavior {
  updateSpeed() {
    super.updateSpeed();
    if (this.isCollision.left) {
      this.inverseSprite = false;
    } else if (this.isCollision.right) {
      this.inverseSprite = true;
    }
    if (this.isCollision.bottom) {
      this.speed.addX((this.inverseSprite ? -1 : 1) * this.constants.physics.run);
    }
  }
}
