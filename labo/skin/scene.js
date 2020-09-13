import Scene from '../lib/webgl/scenes/SceneLampe';
import Mat4 from '../lib/webgl/maths/Mat4';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.model = new Mat4();
    this.model.identity();
  }

  update() {
    super.update();
    this.model.identity();
    this.model.rotate(this.time * 0.5, 0, 1, 0);
    this.setLampeInfos(this.mngProg.get(this.config.MAIN_PROG));
  }

  render() {
    super.render();
    this.mngGltf
      .get(this.config.MAIN_OBJ)
      .render(this.mngProg.get(this.config.MAIN_PROG), this.model);
  }
}
