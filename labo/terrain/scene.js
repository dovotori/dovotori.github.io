import Scene from '../lib/webgl/scenes/SceneCamera';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import getGrid from '../lib/webgl/primitives/terrain';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);
    const { width, height } = config;
    this.vbo = new Primitive(gl, getGrid(width, height, { withThick: true }));
    this.vbo.setModeDessin(this.gl.TRIANGLE_STRIP);
    this.noiseTex = new TextureNoise(gl, width, height);
    this.model = new Mat4();
  }

  render() {
    super.render();
    this.model.identity();
    // this.model.rotate(this.time * 0.01, 0, 1, 0);
    const program = this.mngProg.get('terrain');
    program.setMatrix('model', this.model.get());
    program.setTexture(0, this.noiseTex.get(), 'textureMap');
    program.setFloat('time', this.time);
    this.vbo.render(program.get());
  }
}
