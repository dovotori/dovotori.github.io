import Perso from "./PersoLife";
import Behavior from "../behaviors/BehaviorBackAndForth";

export default class extends Perso {
  constructor({ constants, sprites, viewBox, tileSize }) {
    super({
      constants,
      sprites,
      viewBox,
    });
    this.behavior = new Behavior(constants, this.updateState, tileSize);
    this.setInverseColor(true);
  }

  reset = () => {
    super.reset();
    if (this.behavior) {
      this.behavior.reset();
    }
  };
}
