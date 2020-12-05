import Scene from '../lib/webgl/scenes/SceneLampe';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import getTerrain from '../lib/webgl/primitives/terrain';
import TextureNoise from '../lib/webgl/textures/TexturePerlinNoise';
// import Buffers from '../lib/webgl/postprocess/Buffers';
import { hexToRgb } from '../lib/webgl/utils/color';
import Fbo from '../lib/webgl/gl/Fbo';

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

    const { width, height, colors, waterLevel } = config.terrain;

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
    const progWater = this.mngProg.get('water');
    const progShadow = this.mngProg.get('shadow');
    const progTerrainDepth = this.mngProg.get('terrainDepth');
    const progThreesShadow = this.mngProg.get('instancingDepth');

    [progTerrain, progThrees, progShadow, progWater, progTerrainDepth, progThreesShadow].forEach(
      (p) => {
        TerrainScene.setFog(p, config.fog);
        TerrainScene.setTerrain(p, config.terrain);
        p.setVector('gridSize', [width, height]);
        p.setFloat('waterLevel', waterLevel);
        this.setLampeInfos(p);
      }
    );

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

    const offset = {
      componentType: gl.FLOAT,
      count: threeCount,
      size: 3,
      type: 'VEC3',
      values: new Float32Array(pos),
    };

    const acolor = {
      componentType: gl.FLOAT,
      count: threeCount,
      size: 3,
      type: 'VEC3',
      values: new Float32Array(col),
    };

    const size = {
      componentType: gl.FLOAT,
      count: threeCount,
      size: 1,
      type: 'FLOAT',
      values: new Float32Array(siz),
    };

    this.mngGltf.get('three').addInstancingVbos(threeCount, {
      offset,
      acolor,
      size,
    });
  }

  update(time) {
    super.update(time);
    this.model.identity();
    this.model.rotate(this.time * 0.01, 0, 1, 0);
    // this.model.scale(2);

    const normalMatrix = this.model.getMatrice3x3();
    normalMatrix.inverse();
    normalMatrix.transpose();

    this.targetX.update();
    this.targetZ.update();

    const slowTime = this.time * 0.0001;
    const moving = [this.targetX.get(), this.targetZ.get()];
    // const moving = [this.targetX.get() + slowTime, this.targetZ.get() + slowTime];

    const progTerrain = this.mngProg.get('terrain');
    const progThrees = this.mngProg.get('instancing');
    const progWater = this.mngProg.get('water');
    const progShadow = this.mngProg.get('shadow');
    const progTerrainDepth = this.mngProg.get('terrainDepth');
    const progThreesShadow = this.mngProg.get('instancingDepth');

    [progTerrain, progThrees, progShadow, progWater, progTerrainDepth, progThreesShadow].forEach(
      (p) => {
        p.setMatrix('model', this.model.get());
        p.setMatrix('normalMatrix', normalMatrix.get());
        p.setVector('moving', moving);
      }
    );
    progWater.setFloat('time', slowTime);

    this.mngGltf.get('antenna').update(time * 0.1);
  }

  waterPasses() {
    const progTerrain = this.mngProg.get('terrain');
    const progWater = this.mngProg.get('water');

    progTerrain.setFloat('reflectPass', 1);
    progTerrain.setFloat('refractPass', 0);
    progTerrain.setMatrix(
      'view',
      this.camera.getReflectViewMatrix(this.config.terrain.waterLevel).get()
    );
    this.fbo.start();
    this.vbo.render(progTerrain.get());
    this.fbo.end();

    progTerrain.setFloat('reflectPass', 0);
    progTerrain.setFloat('refractPass', 1);
    progTerrain.setMatrix('view', this.camera.getView().get());
    this.fbo2.start();
    this.vbo.render(progTerrain.get());
    this.fbo2.end();
    progTerrain.setFloat('refractPass', 0);

    progWater.setTexture(0, this.fbo.getTexture().get(), 'reflectMap');
    progWater.setTexture(1, this.fbo2.getTexture().get(), 'refractMap');
    progWater.setTexture(2, this.mngTex.get('waterN').get(), 'normaleMap');
    progWater.setTexture(3, this.mngTex.get('dudv').get(), 'distortionMap');
  }

  shadowPass() {
    const lampe = this.getLampe(0);
    this.shadow.start(lampe);
    this.vbo.render(this.shadow.getProgram().get());
    this.mngGltf.get('three').render(this.mngProg.get('instancing'), this.model);
    this.shadow.end();

    this.shadow.setBrightContrast(0.0, 3.0);
    // this.shadow.setBlur();
  }

  renderBasiqueForLampeDepth = () => {
    const lampe = this.getLampe(0);
    ['terrainDepth', 'instancingDepth'].forEach((keyProg) => {
      const program = this.mngProg.get(keyProg);
      lampe.setDepthProgram(program);
    });
    lampe.start();
    // this.vbo.render(this.mngProg.get('terrainDepth').get());
    // this.mngGltf.get('three').render(this.mngProg.get('instancingDepth'), this.model);
    lampe.end();
  };

  render() {
    super.render();

    // this.waterPasses();
    // this.shadowPass();

    // this.postProcess.start();
    // this.vbo.render(this.mngProg.get('terrain').get());
    // this.vbo.render(this.mngProg.get('water').get());
    // this.mngGltf.get('three').render(this.mngProg.get('instancing'), this.model);
    // this.postProcess.end();

    // this.postProcess.setComposeShadow(this.shadow.getTexture().get());
    // this.postProcess.render();
    // this.postProcess.render(this.getLampe(0).getDepthTexture().get());

    this.model.scale(0.3);
    // this.model.translate(0.0, 0.6, 0.0);
    this.mngGltf.get('antenna').render(this.mngProg.get('gltf'), this.model);
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
