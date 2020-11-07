import Scene from '../lib/webgl/scenes/SceneCamera';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import getGrid from '../lib/webgl/primitives/terrain';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);
    const { width, height } = config;
    console.log(getGrid(width, height));
    this.vbo = new Primitive(gl, getGrid(width, height));
    this.vbo.setModeDessin(gl.LINE_STRIP);
    this.noiseTex = new TextureNoise(gl, width, height);
    this.model = new Mat4();
  }

  render() {
    super.render();
    this.model.identity();
    // this.model.rotate(Math.cos(this.time * 0.001) * 50.0, 0, 1, 0);
    this.model.rotate(this.time * 0.01, 0, 1, 0);
    const program = this.mngProg.get('terrain');
    program.setMatrix('model', this.model.get());
    program.setTexture(0, this.noiseTex.get(), 'textureMap');
    program.setFloat('time', this.time);
    this.vbo.render(program.get());
  }
}
