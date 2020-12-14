import Behavior from './BehaviorCollision';

export default class extends Behavior {
  update(map, tileSize) {
    const shouldContinue = super.update(map, tileSize);
    if (shouldContinue) {
      this.updateSpeed();
    }
    return shouldContinue;
  }

  updateSpeed() {
    this.setDamping();
    this.setGravity();
    this.setClamping();
  }

  setGravity() {
    const { gravity } = this.constants.physics;
    if (!this.isCollision.bottom) {
      this.speed.addY(-gravity);
    }
  }

  setDamping() {
    const { damping } = this.constants.physics;

    if (Math.abs(this.speed.getX()) > 0.01) {
      this.speed.multiplyX(damping.x);
    } else {
      this.speed.setX(0);
    }

    // if (Math.abs(this.speed.getY()) > 0.01) {
    //   this.speed.multiplyY(damping.y);
    // } else {
    //   this.speed.setY(0);
    // }
  }

  setClamping() {
    const { clamp } = this.constants.physics;
    if (this.speed.getX() > clamp.x) this.speed.setX(clamp.x);
    if (this.speed.getX() < -clamp.x) this.speed.setX(-clamp.x);
    if (this.speed.getY() > clamp.y) this.speed.setY(clamp.y);
    if (this.speed.getY() < -clamp.y) this.speed.setY(-clamp.y);
  }
}
