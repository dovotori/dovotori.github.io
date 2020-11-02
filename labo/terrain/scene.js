import Scene from '../lib/webgl/scenes/SceneCamera';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    const position = [];
    const indices = [];

    this.vbo = new Primitive(gl, { position, indices });
    this.model = new Mat4();
  }

  render() {
    super.render();
    this.model.identity();
    this.model.rotate(Math.cos(this.time * 0.001) * 50.0, 0, 1, 0);
    this.mngProg.get('vertexColor').setMatrix('model', this.model.get());
    // this.bloom.start();
    this.vbo.render(this.mngProg.get('vertexColor').get());
    // this.bloom.end();
    // this.bloom.render();
  }
}
