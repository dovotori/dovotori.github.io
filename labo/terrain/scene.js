import Scene from '../lib/webgl/scenes/SceneLampe';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import getTerrain from '../lib/webgl/primitives/terrain';
import getGrid from '../lib/webgl/primitives/grid';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';
// import Buffers from '../lib/webgl/postprocess/Buffers';
import { hexToRgb } from '../lib/webgl/utils/color';

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
    const { width, height, colors } = config.terrain;

    this.targetX = new Spring(0);
    this.targetZ = new Spring(0);
    this.model = new Mat4();

    this.vbo = new Primitive(gl, getTerrain(width, height, { withThick: true, thicknessY: -0.1 }));
    this.vbo.setModeDessin(this.gl.TRIANGLE_STRIP);

    // this.vbo = new Primitive(gl, getGrid(width, height, { withThick: true, thicknessY: -0.1 }));
    // this.vbo.setModeDessin(this.gl.TRIANGLES);

    this.noiseTex = new TextureNoise(gl, 128, 128);

    const prog1 = this.mngProg.get('terrain');
    const prog2 = this.mngProg.get('instancing');
    const prog3 = this.mngProg.get('terrainWater');
    [prog1, prog2].forEach((p) => {
      TerrainScene.setFog(p, config.fog);
      TerrainScene.setTerrain(p, config.terrain);
    });
    prog1.setTexture(0, this.noiseTex.get(), 'textureMap');
    prog1.setVector('gridSize', [width, height]);
    prog3.setVector('gridSize', [width, height]);
    TerrainScene.setFog(prog3, config.fog);

    colors.forEach((hex, i) => {
      const { r, g, b } = hexToRgb(hex);
      prog1.setVector(
        `colors[${i}]`,
        [r, g, b].map((c) => c / 255)
      );
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
    const formatedColors = new Float32Array(col);
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
        values: formatedColors,
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
    // this.model.scale(2);

    this.targetX.update();
    this.targetZ.update();

    const time = this.time * 0.0001;
    const moving = [this.targetX.get() + time, this.targetZ.get() + time];

    const prog1 = this.mngProg.get('terrain');
    const prog2 = this.mngProg.get('instancing');
    const prog3 = this.mngProg.get('terrainWater');

    prog1.setMatrix('model', this.model.get());
    prog1.setVector('moving', moving);
    prog2.setVector('moving', moving);
    prog3.setMatrix('model', this.model.get());
    prog3.setVector('moving', [this.time * 0.0001, this.time * 0.0001]);

    // this.vbo.render(prog1.get());
    this.vbo.render(prog3.get());
    // this.mngGltf.get('three').render(prog2, this.model);

    // this.renderShadow();
  }

  renderShadow() {
    const lampe = this.getLampe(0);
    this.shadow.start(lampe);
    const pr = this.shadow.getProgram();
    pr.setMatrix('model', this.model.get());

    this.vbo.render(pr.get());
    // this.mngGltf.get('three').render(prog2, this.model);

    this.shadow.end();
    // this.shadow.setBrightContrast(0.0, 4.0);
    // this.shadow.setBlur();
    this.postProcess.render(this.shadow.getTexture().get());
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
