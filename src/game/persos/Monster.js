import PersoCollision from './PersoCollision';
import Behavior from '../behaviors/BehaviorBackAndForth';

export default class extends PersoCollision {
  constructor({
    id, constants, sprites, viewBox, tileSize,
  }) {
    super({
      id, constants, sprites, viewBox,
    });
    this.behavior = new Behavior(constants, this.updateState, tileSize);
    this.setInverseColor(true);
  }
}
