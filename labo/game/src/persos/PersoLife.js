import Perso from './PersoCollision';
import Target from '../../../lib/webgl/maths/Target';

export default class extends Perso {
  constructor({ constants, sprites, viewBox }) {
    super({ constants, sprites, viewBox });
    this.life = constants.life;
    this.callbackDeath = null;
    this.targetDamage = new Target(0, 0.1);
    if (constants.displayLife) {
      this.bar = document.createElement('meter');
      this.bar.setAttribute('data-id', constants.id);
      this.bar.setAttribute('min', 0);
      this.bar.setAttribute('max', constants.life);
      this.bar.setAttribute('value', this.life);
      this.insert(document.querySelector('#gameinfos'));
    }
  }

  update(map, tileSize) {
    super.update(map, tileSize);
    this.collisionBox.update(...this.getCollisionInfos());
    this.targetDamage.update();
  }

  setCallbackDeath = (callback) => {
    this.callbackDeath = callback;
  };

  setLife = (value) => {
    this.life = value;
    this.bar.setAttribute('value', this.life);
  };

  setDamage = (value) => {
    this.life -= value;
    this.targetDamage.setDirect(2);
    if (this.bar) this.bar.setAttribute('value', this.life);

    if (this.life <= 0) {
      this.behavior.setStatus(this.constants.states.DIE);
      this.stateSprite.set(this.constants.states.DIE);
      this.collisionCallback.removeBox(this.constants.id);
    }
  };

  insert = (container) => {
    if (container) {
      container.appendChild(this.bar);
    }
  };

  render(program, texture, objet) {
    program.setFloat('damage', this.targetDamage.get());
    super.render(program, texture, objet);
  }

  getLife() {
    return this.life;
  }

  reset() {
    super.reset();
    this.life = this.constants.life;
    if (this.bar) this.bar.setAttribute('value', this.life);
  }
}
