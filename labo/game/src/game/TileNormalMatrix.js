import StateSprite from "../../../lib/webgl/logic/StateSprite";
import MeshSprite from "../../../lib/webgl/meshes/MeshSpriteNormalMatrix";

export default class extends MeshSprite {
  constructor(tiles) {
    super();
    this.state = new StateSprite(tiles);
    this.state.set(tiles.colors["000"].pattern);
  }

  render(objet, program, texture) {
    program.setTexture(0, texture.get(), "textureMap");
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
