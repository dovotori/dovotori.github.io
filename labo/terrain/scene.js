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

    const iterationsCount = 4;
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < iterationsCount; i++) {
      pos.push(Math.random() * 2.0 - 1.0, 0, Math.random() * 2.0 - 1.0);
      col.push(0.4, 0.6, Math.random());
      // siz.push(0.1 + Math.random() * 0.1);
      siz.push(1.0);
    }
    const offsets = new Float32Array(pos);
    const colors = new Float32Array(col);
    const size = new Float32Array(siz);
    this.mngGltf.get('three').addInstancingVbos(iterationsCount, {
      offset: {
        componentType: gl.FLOAT,
        count: iterationsCount,
        size: 3,
        type: 'VEC3',
        values: offsets,
      },
      acolor: {
        componentType: gl.FLOAT,
        count: iterationsCount,
        size: 3,
        type: 'VEC3',
        values: colors,
      },
      size: {
        componentType: gl.FLOAT,
        count: iterationsCount,
        size: 1,
        type: 'FLOAT',
        values: size,
      },
    });
  }

  render() {
    super.render();
    this.model.identity();
    // this.model.rotate(this.time * 0.1, 0, 1, 0);

    const time = this.time * 0.001;

    const program = this.mngProg.get('terrain');
    program.setMatrix('model', this.model.get());
    program.setTexture(0, this.noiseTex.get(), 'textureMap');
    program.setFloat('time', time);
    this.vbo.render(program.get());

    const prog2 = this.mngProg.get('instancing');
    prog2.setFloat('time', time);
    this.mngGltf.get('three').render(prog2, this.model);
  }
}
