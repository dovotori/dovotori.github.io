import Perso from './PersoBullets';
import Behavior from '../behaviors/BehaviorInteraction';

export default class extends Perso {
  constructor({ constants, sprites, viewBox, tileSize, bullets, fxs }) {
    super({
      constants,
      sprites,
      viewBox,
      bullets,
      fxs,
    });
    this.behavior = new Behavior(constants, this.updateState, tileSize);
  }

  setInteraction = (keyboard) => {
    this.behavior.setInteraction(keyboard);
  };

  getDashing() {
    return this.behavior.getDashing();
  }

  reset() {
    if (this.behavior) {
      this.behavior.reset();
    }
    super.reset();
  }
}
