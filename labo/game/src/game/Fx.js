import StateSprite from '../../../lib/utils-3d/core/StateSprite';
import Vec3 from '../../../lib/utils/maths/Vec3';
import MeshSprite from '../../../lib/webgl/meshes/MeshSprite';

export default class extends MeshSprite {
  constructor(constants, sprites, viewBox, startPos, status, callback) {
    super();
    this.inverseX = false;

    this.stateSprite = new StateSprite(sprites, callback);
    this.stateSprite.set(constants.states[Object.keys(constants.states)[0]]);
    this.viewBox = viewBox;
    this.constants = constants;
    this.sprites = sprites;
    this.position = new Vec3(
      startPos.getX() || constants.x || 0,
      startPos.getY() || constants.y || 0,
      startPos.getZ() || constants.z || 0,
    );
    this.stateSprite.reload(status);
  }

  update(time) {
    super.update(time);
    this.stateSprite.update();
  }

  render(program, texture, objet) {
    const { w, h, px, py } = this.stateSprite.getRelSize();
    let offsetX = 0;
    if (px !== null) {
      offsetX = this.inverseX ? -w - px : w - (w - px);
    }
    this.setScale(w, h, 1);
    this.setTranslate(
      this.position.getX() - this.viewBox.x + offsetX,
      this.position.getY() - this.viewBox.y - (1 - h) + (py || 0),
      this.position.getZ(),
    );
    program.setTexture(0, texture.get(), 'textureMap');
    program.setInt('inverseX', this.inverseX ? 1 : 0);
    super.render(objet, program);
    this.setSprite(this.stateSprite.get());
  }

  setInverseX(value) {
    this.inverseX = value;
  }
}
