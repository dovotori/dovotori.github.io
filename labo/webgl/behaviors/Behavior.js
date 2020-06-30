import Vec3 from '../maths/Vec3';

export default class {
  constructor(constants, updateState) {
    this.constants = constants;
    this.updateState = updateState;
    this.position = new Vec3();
    this.status = null;
    this.speed = new Vec3();
    this.size = new Vec3(constants.w || 1, constants.h || 1, 1);
    this.inverseSprite = false;
    this.statusChanged = false;
    this.reset();
  }

  update() {
    const shouldContinue = this.shoudContinue();
    if (shouldContinue) {
      this.statusChanged = false;
      const oldStatus = this.status;
      this.defineNextStatus();
      if (this.updateState) {
        this.updateState(this.status, this.inverseSprite);
      }
      if (oldStatus !== this.status) {
        this.statusChanged = true;
      }
    }
    return shouldContinue;
  }

  shoudContinue = () => {
    const { DIE } = this.constants.states;
    return this.status !== DIE;
  };

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
    if (nextState) {
      this.status = nextState;
    }
  };

  setPosition(x, y, z = 0) {
    return this.position.set(x, y, z);
  }

  setSize(x, y, z = 1) {
    this.size.set(x, y, z);
  }

  setStatus(status) {
    this.status = status;
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

  reset = () => {
    const { x, y, z, states } = this.constants;
    this.position.set(x || 0, y || 0, z || 0);
    this.status = states[Object.keys(states)[0]];
    this.speed.set(0, 0, 0);
  };
}
