import Perso from "./PersoLife";
import Fxs from "../game/Fxs";

export default class PersoFx extends Perso {
  constructor({ constants, sprites, viewBox, fxs }) {
    super({ constants, sprites, viewBox });
    if (fxs) {
      this.fxs = new Fxs(fxs.constants, fxs.sprites, viewBox);
    }
  }

  update(map, tileSize) {
    super.update(map, tileSize);
    if (this.fxs) {
      this.fxs.update();

      const { JUMP_UP, RUN_JUMP_UP } = this.constants.states;
      const { DUST } = this.fxs.getConstants().states;
      const status = this.getStatus();
      const lastJumpingPos = this.getLastJumpingPosition();
      const lastRunningPosition = this.getLastRunningPosition();

      if (
        this.isStatusChanged() &&
        (status === JUMP_UP || status === RUN_JUMP_UP)
      ) {
        this.fxs.createNewOne(lastJumpingPos, DUST);
      }
      if (lastRunningPosition !== null) {
        this.fxs.createNewOne(lastRunningPosition, DUST);
      }
    }
  }

  renderFxs(prog, tex, obj) {
    this.fxs.render(prog, tex, obj);
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
}
