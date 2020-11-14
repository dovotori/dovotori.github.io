import Scene from '../lib/webgl/scenes/SceneCamera';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import getGrid from '../lib/webgl/primitives/terrain';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';

class TerrainScene extends Scene {
  static setFog(program, fogConfig) {
    const { start, end, color } = fogConfig;
    program.setFloat('fogStart', start);
    program.setFloat('fogEnd', end);
    program.setVector('fogColor', color);
  }

  static setTerrain(program, terrainConfig) {
    const { lacunarity, persistance } = terrainConfig;
    program.setFloat('lacunarity', lacunarity);
    program.setFloat('persistance', persistance);
  }

  constructor(gl, config, assets) {
    super(gl, config, assets);
    const { width, height } = config.terrain;

    this.targetX = new Spring(0);
    this.targetZ = new Spring(0);
    this.model = new Mat4();

    this.vbo = new Primitive(gl, getGrid(width, height, { withThick: true, thicknessY: -0.1 }));
    this.vbo.setModeDessin(this.gl.TRIANGLE_STRIP);
    this.noiseTex = new TextureNoise(gl, width, height);

    const prog1 = this.mngProg.get('terrain');
    const prog2 = this.mngProg.get('instancing');
    [prog1, prog2].forEach((p) => {
      TerrainScene.setFog(p, config.fog);
      TerrainScene.setTerrain(p, config.terrain);
    });

    const threeCount = 100;
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < threeCount; i++) {
      pos.push(Math.random() * 2.0 - 1.0, 0, Math.random() * 2.0 - 1.0);
      col.push(0.4, 0.6, Math.random());
      siz.push(0.1 + Math.random() * 0.1);
    }
    const offsets = new Float32Array(pos);
    const colors = new Float32Array(col);
    const size = new Float32Array(siz);
    this.mngGltf.get('three').addInstancingVbos(threeCount, {
      offset: {
        componentType: gl.FLOAT,
        count: threeCount,
        size: 3,
        type: 'VEC3',
        values: offsets,
      },
      acolor: {
        componentType: gl.FLOAT,
        count: threeCount,
        size: 3,
        type: 'VEC3',
        values: colors,
      },
      size: {
        componentType: gl.FLOAT,
        count: threeCount,
        size: 1,
        type: 'FLOAT',
        values: size,
      },
    });
  }

  render() {
    super.render();
    this.model.identity();
    this.model.rotate(this.time * 0.01, 0, 1, 0);
    this.model.scale(2);

    this.targetX.update();
    this.targetZ.update();

    const time = this.time * 0.0001;
    const moving = [this.targetX.get() + time, this.targetZ.get() + time];

    const prog1 = this.mngProg.get('terrain');
    prog1.setMatrix('model', this.model.get());
    prog1.setTexture(0, this.noiseTex.get(), 'textureMap');
    prog1.setVector('moving', moving);
    this.vbo.render(prog1.get());

    const prog2 = this.mngProg.get('instancing');
    prog2.setVector('moving', moving);
    this.mngGltf.get('three').render(prog2, this.model);
  }

  setKeyboardInteraction(keyboard) {
    const { LEFT, RIGHT, UP, DOWN } = this.config.keyboard;
    if (keyboard.isPressed(LEFT)) {
      this.targetX.set(-0.01);
    }
    if (keyboard.isPressed(RIGHT)) {
      this.targetX.set(0.01);
    }
    if (keyboard.isPressed(UP)) {
      this.targetZ.set(-0.01);
    }
    if (keyboard.isPressed(DOWN)) {
      this.targetZ.set(0.01);
    }
  }
}

export default TerrainScene;
