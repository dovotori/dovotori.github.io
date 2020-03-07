import Perso from './Perso';
import { CollisionBox } from '../collisions';

export default class extends Perso {
  constructor({
    id, constants, sprites, viewBox,
  }) {
    super({ constants, sprites, viewBox });
    this.id = id || constants.id;
    this.collisionBox = new CollisionBox();
    this.collisionBox.setup(this.id);
  }

  update(map, tileSize) {
    super.update(map, tileSize);
    this.collisionBox.update(...this.getCollisionInfos());
  }

  getCollisionBox() {
    return this.collisionBox;
  }

  getId() {
    return this.id;
  }
}
