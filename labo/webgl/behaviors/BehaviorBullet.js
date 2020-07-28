import Behavior from './BehaviorCollision';

export default class extends Behavior {
  constructor(constants, updateState = null, tileSize, startPos, goLeft) {
    super(constants, updateState, tileSize);
    this.isAiming = true;
    this.goLeft = goLeft;
    this.position.setX(startPos.getX());
    this.position.setY(startPos.getY());
    this.startPos = startPos;
  }

  update(map, tileSize) {
    if (this.isAiming) {
      this.position.setX(this.startPos.getX());
      this.position.setY(this.startPos.getY());
    } else {
      super.update(map, tileSize);
    }
  }

  shoot() {
    this.isAiming = false;
    const { speed } = this.constants.physics;
    this.speed.setX(this.goLeft ? -speed : speed);
  }

  setStartPos(startPos) {
    this.startPos = startPos;
  }
}
