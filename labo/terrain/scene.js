import Scene from '../lib/webgl/scenes/SceneLampe';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import getTerrain from '../lib/webgl/primitives/terrain';
import getGrid from '../lib/webgl/primitives/grid';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';
// import Buffers from '../lib/webgl/postprocess/Buffers';
import { hexToRgb } from '../lib/webgl/utils/color';

// const COLORS = [
//   // MARRONS DARK TO LIGHT
//   '#675553',
//   '#89776b',
//   '#c8baad',
//   // // LIGHT GREEN
//   '#c1baa8',
//   '#d1cfb8',
//   // SHADOW BLUE
//   '#86999d',
//   '#a3b3c0',
//   '#dde3e1',
// ];

const COLORS_STRANDING = [
  // DIRT
  '#251a16',
  '#6e6254',
  '#8b6a47',
  // ROC
  '#5d564c',
  // '#978d72',
  '#989b56',
  // GREEN
  '#6d753a',
  '#89934c',
  '#8b8f54',
  '#ffffff',
];

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

    this.vbo = new Primitive(gl, getTerrain(width, height, { withThick: true, thicknessY: -0.1 }));
    this.vbo.setModeDessin(this.gl.TRIANGLE_STRIP);
    this.noiseTex = new TextureNoise(gl, 128, 128);
    // const primtive = getGrid(100, 100, { withThick: true, thicknessY: -0.2 });
    // this.vbo2 = new Primitive(gl, primtive);
    // this.vbo2.setModeDessin(this.gl.TRIANGLES);

    const prog1 = this.mngProg.get('terrain');
    const prog2 = this.mngProg.get('instancing');
    [prog1, prog2].forEach((p) => {
      TerrainScene.setFog(p, config.fog);
      TerrainScene.setTerrain(p, config.terrain);
    });
    prog1.setVector('gridSize', [width, height]);

    COLORS_STRANDING.forEach((hex, i) => {
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
    // this.model.scale(2);

    this.targetX.update();
    this.targetZ.update();

    const time = this.time * 0.0001;
    const moving = [this.targetX.get() + time, this.targetZ.get() + time];

    const prog1 = this.mngProg.get('terrain');
    prog1.setMatrix('model', this.model.get());
    prog1.setTexture(0, this.noiseTex.get(), 'textureMap');
    prog1.setVector('moving', moving);

    const prog2 = this.mngProg.get('instancing');
    prog2.setVector('moving', moving);

    this.vbo.render(prog1.get());
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
