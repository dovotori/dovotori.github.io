import Scene from '../lib/webgl/scenes/SceneLampe';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import getTerrain from '../lib/webgl/primitives/terrain';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';
// import Buffers from '../lib/webgl/postprocess/Buffers';
import { hexToRgb } from '../lib/webgl/utils/color';
import Fbo from '../lib/webgl/gl/Fbo';

const WATER_LEVEL = 0.4;

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

    this.fbo = new Fbo(this.gl, config.width, config.height, true);
    this.fbo2 = new Fbo(this.gl, config.width, config.height, true);
    this.fbo3 = new Fbo(this.gl, config.width, config.height, true);

    const { width, height, colors } = config.terrain;

    this.targetX = new Spring(0);
    this.targetZ = new Spring(0);
    this.model = new Mat4();

    this.vbo = new Primitive(gl, getTerrain(width, height, { withThick: true, thicknessY: -0.1 }));
    this.vbo.setModeDessin(this.gl.TRIANGLE_STRIP);

    // this.vbo = new Primitive(gl, getGrid(width, height, { withThick: true, thicknessY: -0.1 }));
    // this.vbo.setModeDessin(this.gl.TRIANGLES);

    this.noiseTex = new TextureNoise(gl, 128, 128);

    const progTerrain = this.mngProg.get('terrain');
    const progThrees = this.mngProg.get('instancing');
    const progWater = this.mngProg.get('terrainWater');
    [progTerrain, progThrees].forEach((p) => {
      TerrainScene.setFog(p, config.fog);
      TerrainScene.setTerrain(p, config.terrain);
    });
    progTerrain.setTexture(0, this.noiseTex.get(), 'textureMap');
    progTerrain.setVector('gridSize', [width, height]);
    progWater.setVector('gridSize', [width, height]);
    progTerrain.setFloat('waterLevel', WATER_LEVEL);
    progWater.setFloat('waterLevel', WATER_LEVEL);
    progWater.setTexture(2, this.mngTex.get('waterN').get(), 'normaleMap');
    progWater.setTexture(3, this.mngTex.get('dudv').get(), 'distortionMap');
    TerrainScene.setFog(progWater, config.fog);

    this.setLampeInfos(progWater);
    this.setLampeInfos(progTerrain);
    this.setLampeInfos(progThrees);

    colors.forEach((hex, i) => {
      const { r, g, b } = hexToRgb(hex);
      progTerrain.setVector(
        `colors[${i}]`,
        [r, g, b].map((c) => c / 255)
      );
    });

    const threeCount = 400;
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < threeCount; i++) {
      pos.push(Math.random() * 2.0 - 1.0, 0, Math.random() * 2.0 - 1.0);
      col.push(0.4, 0.6, Math.random());
      siz.push(0.05 + Math.random() * 0.06);
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

    const normalMatrix = this.model.getMatrice3x3();
    normalMatrix.inverse();
    normalMatrix.transpose();

    this.targetX.update();
    this.targetZ.update();

    const time = this.time * 0.0001;
    const moving = [this.targetX.get() + time, this.targetZ.get() + time];

    const progTerrain = this.mngProg.get('terrain');
    const progThrees = this.mngProg.get('instancing');
    const progWater = this.mngProg.get('terrainWater');

    progTerrain.setMatrix('model', this.model.get());
    progWater.setMatrix('model', this.model.get());

    progTerrain.setMatrix('normalMatrix', normalMatrix.get());
    progWater.setMatrix('normalMatrix', normalMatrix.get());
    progThrees.setMatrix('normalMatrix', normalMatrix.get());

    progTerrain.setVector('moving', moving);
    progThrees.setVector('moving', moving);
    progWater.setVector('moving', moving);
    progWater.setFloat('time', this.time * 0.0001);

    this.fbo.start();
    progTerrain.setFloat('reflectPass', 1);
    progTerrain.setFloat('refractPass', 0);
    progTerrain.setMatrix('view', this.camera.getReflectViewMatrix(WATER_LEVEL).get());
    this.vbo.render(progTerrain.get());
    this.fbo.end();
    progWater.setTexture(0, this.fbo.getTexture().get(), 'reflectMap');

    this.fbo2.start();
    progTerrain.setFloat('reflectPass', 0);
    progTerrain.setFloat('refractPass', 1);
    progTerrain.setMatrix('view', this.camera.getView().get());
    this.vbo.render(progTerrain.get());
    this.fbo2.end();
    progWater.setTexture(1, this.fbo2.getTexture().get(), 'refractMap');

    progTerrain.setFloat('refractPass', 0);

    // this.postProcess.render(this.fbo3.getDepthTexture().get());

    // this.renderShadow();

    this.vbo.render(progTerrain.get());
    this.vbo.render(progWater.get());
    this.mngGltf.get('three').render(progThrees, this.model);
  }

  renderShadow() {
    const lampe = this.getLampe(0);
    this.shadow.start(lampe);
    const pr = this.shadow.getProgram();
    pr.setMatrix('model', this.model.get());

    this.vbo.render(pr.get());
    // this.mngGltf.get('three').render(progThrees, this.model);

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
