import { Vec3 } from '../geometry';

export default class {
  constructor(constants, updateState) {
    this.constants = constants;
    this.updateState = updateState;
    this.position = new Vec3(
      constants.x || 0,
      constants.y || 0,
      constants.z || 0,
    );
    this.status = constants.states[Object.keys(constants.states)[0]];
    this.speed = new Vec3(0, 0, 0);
    this.size = new Vec3(constants.w || 1, constants.h || 1, 1);
    this.inverseSprite = false;
  }

  update() {
    this.statusChanged = false;
    this.defineNextStatus();
    if (this.updateState) {
      this.updateState(this.status, this.inverseSprite);
    }
  }

  isLock() {
    const { lockStates } = this.constants;
    return lockStates && lockStates.indexOf(this.status) !== -1;
  }

  defineNextStatus() {
    const { JUMP_DOWN, RUN_JUMP_DOWN } = this.constants.states;

    if (!this.isLock()) {
      // fall
      if (this.speed.getY() < 0) {
        this.status = JUMP_DOWN;
        if (Math.abs(this.speed.getX()) > 0) {
          this.status = RUN_JUMP_DOWN;
        }
      }
    }
  }

  setEndOfAnimation = (nextState) => {
    this.status = nextState;
  };

  setPosition(x, y, z = 0) {
    return this.position.set(x, y, z);
  }

  setSize(x, y, z = 1) {
    this.size.set(x, y, z);
  }

  getPosition() {
    return this.position;
  }

  getStatus() {
    return this.status;
  }

  getSize() {
    return this.size;
  }

  getX() {
    return this.position.getX();
  }

  getY() {
    return this.position.getY();
  }

  getZ() {
    return this.position.getZ();
  }

  getSpeed() {
    return this.speed.get();
  }

  getSpeedX() {
    return this.speed.getX();
  }

  getSpeedY() {
    return this.speed.getY();
  }

  addToSpeed(add) {
    this.speed.add(add);
  }

  isStatusChanged() {
    return this.statusChanged;
  }
}
