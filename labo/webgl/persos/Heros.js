import PersoCollision from "./PersoCollision";
import Vec3 from "../maths/Vec3";
import Behavior from "../behaviors/BehaviorInteraction";

export default class extends PersoCollision {
  constructor({ id, constants, sprites, viewBox, tileSize }) {
    super({
      id,
      constants,
      sprites,
      viewBox,
    });
    this.behavior = new Behavior(constants, this.updateState, tileSize);
    this.offsetAiming = this.getAimingOffsetVector();
    this.oldState = null;
    this.aimingPos = new Vec3();
  }

  update(map, tileSize) {
    super.update(map, tileSize);
    this.aimingPos.equal(this.behavior.getPosition());
    this.aimingPos.addX(
      this.inverseX ? this.offsetAiming.invX : this.offsetAiming.x
    );
    this.aimingPos.addY(this.offsetAiming.y);
  }

  setInteraction = (keyboard) => {
    this.behavior.setInteraction(keyboard);
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
      this.behavior.getZ()
    );
  }

  getLastJumpingPosition() {
    return this.behavior.getLastJumpingPosition();
  }

  getLastRunningPosition() {
    if (
      this.behavior.getStatus() === this.constants.states.RUN &&
      this.stateSprite.isNewStep() &&
      (this.stateSprite.getStep() === 0 || this.stateSprite.getStep() === 2)
    ) {
      return this.behavior.getPosition();
    }
    return null;
  }

  getDashing() {
    return this.behavior.getDashing();
  }

  getAiming() {
    return this.behavior.getAiming();
  }
}
