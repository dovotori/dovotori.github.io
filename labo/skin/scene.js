import Scene from '../lib/webgl/scenes/SceneLampe';
import Mat4 from '../lib/webgl/maths/Mat4';

export default class extends Scene {
  setup() {
    this.model = new Mat4();
    this.model.identity();
  }

  update(time) {
    super.update(time);
    this.model.identity();
    // this.model.rotate(this.time * 0.05, 0, 1, 0);
    // this.model.rotate(-90, 1, 0, 0);
    this.mngGltf.get(this.config.MAIN_OBJ).update(time);
  }

  render() {
    super.render();
    this.mngGltf
      .get(this.config.MAIN_OBJ)
      .render(this.mngProg.get(this.config.MAIN_PROG), this.model);
  }
}
