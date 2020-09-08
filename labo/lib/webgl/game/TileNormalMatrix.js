import StateSprite from '../logic/StateSprite';
import MeshSprite from '../meshes/MeshSpriteNormalMatrix';

export default class extends MeshSprite {
  constructor(tiles) {
    super();
    this.state = new StateSprite(tiles);
    this.state.set(tiles.colors['000'].pattern);
  }

  render(objet, program, texture) {
    program.setTexture(0, texture.get());
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
