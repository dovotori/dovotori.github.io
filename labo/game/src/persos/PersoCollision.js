import Perso from './Perso';
import CollisionBox from '../../../lib/webgl/collisions/CollisionBox';

export default class extends Perso {
  constructor({ constants, sprites, viewBox }) {
    super({ constants, sprites, viewBox });
    this.collisionBox = new CollisionBox();
    this.collisionBox.setup(constants.id);
    this.collisionCallback = null;
  }

  update(map, tileSize) {
    super.update(map, tileSize);
    this.collisionBox.update(...this.getCollisionInfos());
  }

  getCollisionBox() {
    return this.collisionBox;
  }

  getCollisionInfos() {
    const { w, h } = this.constants;
    return [...this.getPosition(), w, h];
  }

  getId() {
    return this.constants.id;
  }

  setCallbacks({ addBoxes, removeBox }) {
    this.collisionCallback = { addBoxes, removeBox };
  }
}
