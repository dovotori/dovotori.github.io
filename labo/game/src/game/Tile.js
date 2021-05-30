import StateSprite from '../../../lib/webgl/logic/StateSprite';
import MeshSprite from '../../../lib/webgl/meshes/MeshSprite';

export default class extends MeshSprite {
  constructor(sprite) {
    super();
    this.state = new StateSprite(sprite);
    this.state.set('000');
  }

  render(objet, program, texture) {
    program.setTexture(0, texture.get(), 'textureMap');
    this.setSprite(this.state.get());
    super.render(objet, program);
  }

  setState(state) {
    this.state.set(state);
  }

  getState() {
    return this.state.get();
  }
}
