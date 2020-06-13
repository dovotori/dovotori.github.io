import StateSprite from "../logic/StateSprite";
import MeshSprite from "../meshes/MeshSprite";
import Vec3 from "../maths/Vec3";

export default class extends MeshSprite {
  constructor({ constants, sprites, viewBox }) {
    super();
    this.inverseX = false;
    this.stateSprite = new StateSprite(sprites, this.setEndOfAnimation);
    this.stateSprite.set(constants.states[Object.keys(constants.states)[0]]);
    this.viewBox = viewBox;
    this.constants = constants;
    this.sprites = sprites;
    this.setSprite(this.stateSprite.get());
    this.worldPos = new Vec3();
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
    program.setInt("inverseX", this.inverseX ? 1 : 0);
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

  setEndOfAnimation = (state) => {
    this.behavior.setEndOfAnimation(state);
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

  getCollisionInfos() {
    const { w, h } = this.constants;
    return [...this.getPosition(), w, h];
  }
}
