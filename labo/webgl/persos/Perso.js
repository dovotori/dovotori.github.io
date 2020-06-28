import StateSprite from '../logic/StateSprite';
import MeshSprite from '../meshes/MeshSprite';
import Vec3 from '../maths/Vec3';

export default class extends MeshSprite {
  constructor({ constants, sprites, viewBox }) {
    super();
    this.inverseX = false;
    this.stateSprite = new StateSprite(sprites, this.setEndOfAnimation);
    this.viewBox = viewBox;
    this.constants = constants;
    this.sprites = sprites;
    this.worldPos = new Vec3();
    this.reset();
  }

  update(map, tileSize) {
    super.update();
    this.stateSprite.update();
    this.behavior.update(map, tileSize);
  }

  render(program, texture, objet) {
    const { w, h, px, py } = this.stateSprite.getRelSize();
    let offsetX = 0;
    if (px !== null) {
      offsetX = this.inverseX ? -w - px : w - (w - px);
    }
    this.setScale(w, h, 1);
    this.setTranslate(
      this.behavior.getX() - this.viewBox.x + offsetX,
      this.behavior.getY() - this.viewBox.y - (1 - h) + (py || 0),
      this.behavior.getZ()
    );
    program.setTexture(0, texture.get());
    program.setInt('inverseX', this.inverseX ? 1 : 0);
    super.render(objet, program);
    this.setSprite(this.stateSprite.get());
  }

  updateState = (state, inverse) => {
    this.inverseX = inverse;
    this.stateSprite.set(state);
    this.setSprite(this.stateSprite.get());
  };

  addToSpeed(x = 0, y = 0, z = 0) {
    this.behavior.addToSpeed(new Vec3(x, y, z));
  }

  setEndOfAnimation = (currentState, nextState) => {
    if (nextState) {
      this.behavior.setEndOfAnimation(nextState);
    }
    if (currentState === this.constants.states.DIE && this.callbackDeath) {
      this.callbackDeath();
    }
  };

  getX() {
    return this.behavior.getPosition().getX();
  }

  getPosition() {
    return this.behavior.getPosition().get();
  }

  getWorldPosition() {
    return this.worldPos
      .set(
        this.behavior.getX() - this.viewBox.x,
        this.behavior.getY() - this.viewBox.y,
        this.behavior.getZ()
      )
      .get();
  }

  getInverseX() {
    return this.inverseX;
  }

  getStatus() {
    return this.behavior.getStatus();
  }

  isStatusChanged() {
    return this.behavior.isStatusChanged();
  }

  getConstants() {
    return this.constants;
  }

  reset() {
    this.stateSprite.reset();
    this.stateSprite.set(this.constants.states[Object.keys(this.constants.states)[0]]);
    this.setSprite(this.stateSprite.get());
  }
}
