import Vec3 from '../../../lib/utils/maths/Vec3';
import { mapFromRange } from '../../../lib/utils/numbers';
import Behavior from './BehaviorGravity';

export default class extends Behavior {
  constructor(constants, updateState, tileSize) {
    super(constants, updateState, tileSize);
    this.isAnimating = false;
    this.aimingStrength = 0;
    this.inverseSprite = false;
    this.oldInverseSprite = this.inverseSprite;
    this.jumpPosition = new Vec3();
  }

  defineNextStatus() {
    super.defineNextStatus();
    const { WALL, WALL_UP, JUMP_UP, RUN_JUMP_UP } = this.constants.states;
    if (!this.isLock()) {
      // up
      if (this.speed.getY() > 0) {
        this.status = JUMP_UP;
        if (Math.abs(this.speed.getX()) > 0) {
          this.status = RUN_JUMP_UP;
        }
      }

      // landing
      if (this.isCollision.bottom) {
        // wall
        if (this.isCollision.left || this.isCollision.right) {
          this.status = WALL;
        }
      } else if (this.isCollision.left || this.isCollision.right) {
        // mid air
        // wall
        this.status = WALL_UP;
      }
      // force inverse on collision left/right
      if (this.isCollision.left) {
        this.inverseSprite = true;
      } else if (this.isCollision.right) {
        this.inverseSprite = false;
      }
    }
  }

  setInteraction(keyboard) {
    const { physics, states } = this.constants;
    const { keys } = keyboard;
    const { DASH, AIM, SLASH, JUMP_UP, DIE } = states;

    if (this.status === DIE) {
      return;
    }

    if (this.status === AIM) {
      this.aimingStrength = mapFromRange(keyboard.getCharge(keys.W), 0, 40, 0.2, 1);
    }

    const directionSpeed = this.isCollision.bottom ? physics.run : physics.aircontrol;

    if (!this.isCollision.right && keyboard.isPressed(keys.RIGHT)) {
      this.speed.addX(directionSpeed);
      this.inverseSprite = false;
    }

    if (!this.isCollision.left && keyboard.isPressed(keys.LEFT)) {
      this.speed.addX(-directionSpeed);
      this.inverseSprite = true;
    }

    if (!this.isLock()) {
      if (this.isCollision.bottom) {
        if (keyboard.isPressedOne(keys.SPACE)) {
          // this.status = JUMP_LOAD;
          this.jumpPosition.set(this.position.getX(), this.position.getY(), 0);
          this.speed.addY(physics.jump);
          this.status = JUMP_UP;
          this.isCollision.bottom = false;
        }
        if (keyboard.isPressedOne(keys.SHIFT)) {
          this.speed.addX(this.inverseSprite ? -physics.dash : physics.dash);
          this.status = DASH;
        }
        if (keyboard.isPressed(keys.W)) {
          this.status = AIM;
        }
        if (keyboard.isPressedOne(keys.X)) {
          this.status = SLASH;
        }
      }
    }

    // if (this.status === JUMP_LOAD && keyboard.isUp(keys.SPACE)) {
    //   this.speed.addY(
    //     mapFromRange(keyboard.getCharge(keys.SPACE), 0, 20, 0.35, physics.jump)
    //   );
    //   this.jumpPosition.set(this.position.getX(), this.position.getY(), 0);
    //   this.status = JUMP_UP;
    //   this.isCollision.bottom = false;
    // }

    this.resetValues(keyboard);
  }

  resetValues(keyboard) {
    const { states } = this.constants;
    const { keys } = keyboard;
    const { STAND, AIM } = states;

    if (this.status === AIM) {
      // keyboard.resetCharge(keys.W);
    }

    // cancel actions
    if (this.status === AIM && !keyboard.isPressed(keys.W)) {
      this.aimingStrength = 0;
      this.status = STAND;
    }
  }

  getLastJumpingPosition() {
    return this.jumpPosition;
  }

  isAiming() {
    return this.aimingStrength;
  }

  getDashing() {
    const { DASH } = this.constants.states;
    return this.status === DASH;
  }
}
