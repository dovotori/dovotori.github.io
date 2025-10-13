import getTerrain from "../lib/utils-3d/primitives/terrain";
import { hexToRgb } from "../lib/utils/color";
import Mat4 from "../lib/utils/maths/Mat4";
import Spring from "../lib/utils/maths/Spring";
import Vec3 from "../lib/utils/maths/Vec3";
import { fract, mix } from "../lib/utils/numbers";
import Fbo from "../lib/webgl/gl/Fbo";
import Primitive from "../lib/webgl/gl/Primitive";
import Scene from "../lib/webgl/scenes/SceneLampe";
import TextureClouds from "../lib/webgl/textures/TextureClouds";

const hash = (x, y) => {
  const p3 = new Vec3(x, y, x).multiplyNumber(0.13).fract();
  const d = new Vec3(p3.getY(), p3.getZ(), p3.getX()).addNumber(3.333);
  p3.addNumber(p3.dot(d));
  return fract((p3.getX() + p3.getY()) * p3.getZ());
};

const noise = (x, y) => {
  const i = Math.floor(x);
  const j = Math.floor(y);

  const f = fract(x);
  const g = fract(y);

  // Four corners in 2D of a tile
  const a = hash(i, j);
  const b = hash(i + 1, j);
  const c = hash(i, j + 1);
  const d = hash(i + 1, j + 1);

  const u = f * f * (3 - 2 * f);
  const v = g * g * (3 - 2 * g);

  return mix(a, b, u) + (c - a) * v * (1 - u) + (d - b) * u * v;
};

const NB_OCTAVES = 10;

const getTerrainHeight = (coor, config) => {
  const { lacunarity, persistance } = config;
  let result = 0;
  let allAmpli = 0;
  for (let i = 0; i < NB_OCTAVES; i += 1) {
    const frequency = lacunarity ** i;
    const amplitude = persistance ** i;
    result += noise(coor[0] * frequency, coor[1] * frequency) * amplitude;
    allAmpli += amplitude;
  }
  return result / allAmpli;
};

class TerrainScene extends Scene {
  static setFog(program, fogConfig) {
    const { start, end, color } = fogConfig;
    program.setFloat("fogStart", start);
    program.setFloat("fogEnd", end);
    program.setVector("fogColor", color);
  }

  static setTerrain(program, terrainConfig) {
    const { lacunarity, persistance } = terrainConfig;
    program.setFloat("lacunarity", lacunarity);
    program.setFloat("persistance", persistance);
  }

  setup() {
    const { config, gl } = this;

    this.fbo = new Fbo(gl, config.width, config.height, true);
    this.fbo2 = new Fbo(gl, config.width, config.height, true);
    this.fbo3 = new Fbo(gl, config.width, config.height, true);

    const { width, height, colors, waterLevel } = config.terrain;

    this.targetX = new Spring(0);
    this.targetZ = new Spring(0);
    this.model = new Mat4();

    this.vbo = new Primitive(
      gl,
      getTerrain(width, height, { withThick: true, thicknessY: -0.1 }),
    );
    this.vbo.setModeDessin(gl.TRIANGLE_STRIP);

    // this.vbo = new Primitive(gl, getGrid(width, height, { withThick: true, thicknessY: -0.1 }));
    // this.vbo.setModeDessin(gl.TRIANGLES);

    // this.noiseTex = new TextureNoise(gl, 128, 128);
    this.cloudsTex = new TextureClouds(gl, 4, 4);

    const progTerrain = this.mngProg.get("terrain");
    const progThrees = this.mngProg.get("instancing");
    const progWater = this.mngProg.get("water");
    const progShadow = this.mngProg.get("shadow");
    const progTerrainDepth = this.mngProg.get("terrainDepth");
    const progThreesShadow = this.mngProg.get("instancingDepth");

    [
      progTerrain,
      progThrees,
      progShadow,
      progWater,
      progTerrainDepth,
      progThreesShadow,
    ].forEach((p) => {
      TerrainScene.setFog(p, config.fog);
      TerrainScene.setTerrain(p, config.terrain);
      p.setVector("gridSize", [width, height]);
      p.setFloat("waterLevel", waterLevel);
      this.setLampeInfos(p);
    });

    colors.forEach((hex, i) => {
      const { r, g, b } = hexToRgb(hex);
      progTerrain.setVector(
        `colors[${i}]`,
        [r, g, b].map((c) => c / 255),
      );
    });

    const THREE_COUNT = 400;
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < THREE_COUNT; i++) {
      pos.push(Math.random() * 2.0 - 1.0, 0, Math.random() * 2.0 - 1.0);
      col.push(0.4, 0.6, Math.random());
      siz.push(0.05 + Math.random() * 0.06);
    }

    const offset = {
      componentType: gl.FLOAT,
      count: THREE_COUNT,
      size: 3,
      type: "VEC3",
      values: new Float32Array(pos),
    };

    const acolor = {
      componentType: gl.FLOAT,
      count: THREE_COUNT,
      size: 3,
      type: "VEC3",
      values: new Float32Array(col),
    };

    const size = {
      componentType: gl.FLOAT,
      count: THREE_COUNT,
      size: 1,
      type: "FLOAT",
      values: new Float32Array(siz),
    };

    this.mngGltf.get("three").addInstancingVbos(THREE_COUNT, {
      offset,
      acolor,
      size,
    });

    const coor = [-0.6, 0.8];
    this.posAntenna = [
      coor[0],
      getTerrainHeight(coor, config.terrain),
      coor[1],
    ];
    this.isAntennaVisible = false;
    this.currentPosAntenna = this.posAntenna;
  }

  update(time) {
    super.update(time);
    this.model.identity();
    // this.model.rotate(this.time * 0.01, 0, 1, 0);
    // this.model.scale(2);

    const normalMatrix = this.model.getMatrice3x3();
    normalMatrix.inverse();
    normalMatrix.transpose();

    this.targetX.update();
    this.targetZ.update();

    const slowTime = this.time * 0.00001;
    const moving = [this.targetX.get(), this.targetZ.get()];
    // const moving = [this.targetX.get() + slowTime, this.targetZ.get() + slowTime];

    const progTerrain = this.mngProg.get("terrain");
    const progThrees = this.mngProg.get("instancing");
    const progWater = this.mngProg.get("water");
    const progShadow = this.mngProg.get("shadow");
    const progTerrainDepth = this.mngProg.get("terrainDepth");
    const progThreesShadow = this.mngProg.get("instancingDepth");

    [
      progTerrain,
      progThrees,
      progShadow,
      progWater,
      progTerrainDepth,
      progThreesShadow,
    ].forEach((p) => {
      p.setMatrix("model", this.model.get());
      p.setMatrix("normalMatrix", normalMatrix.get());
      p.setVector("moving", moving);
    });
    progWater.setFloat("time", slowTime);

    this.mngGltf.get("antenna").update(time * 0.1);
    this.currentPosAntenna = [
      this.posAntenna[0] - this.targetX.get(),
      this.posAntenna[1],
      this.posAntenna[2] - this.targetZ.get(),
    ];
    this.isAntennaVisible =
      Math.abs(this.currentPosAntenna[0]) > 0 &&
      Math.abs(this.currentPosAntenna[0]) < 1 &&
      Math.abs(this.currentPosAntenna[2]) > 0 &&
      Math.abs(this.currentPosAntenna[2]) < 1;
  }

  waterPasses() {
    const progTerrain = this.mngProg.get("terrain");
    const progThrees = this.mngProg.get("instancing");

    progTerrain.setFloat("reflectPass", 1);
    progTerrain.setFloat("refractPass", 0);
    progTerrain.setMatrix(
      "view",
      this.camera.getReflectViewMatrix(this.config.terrain.waterLevel).get(),
    );
    progThrees.setMatrix(
      "view",
      this.camera.getReflectViewMatrix(this.config.terrain.waterLevel).get(),
    );
    this.fbo.start();
    this.vbo.render(progTerrain.get());
    this.mngGltf.get("three").render(progThrees, this.model);
    this.fbo.end();

    progTerrain.setFloat("reflectPass", 0);
    progTerrain.setFloat("refractPass", 1);
    progTerrain.setMatrix("view", this.camera.getView().get());
    this.fbo2.start();
    this.vbo.render(progTerrain.get());
    this.fbo2.end();
    progTerrain.setFloat("refractPass", 0);
  }

  shadowPass() {
    const lampe = this.getLampe(0);
    this.shadow.start(lampe);
    this.vbo.render(this.shadow.getProgram().get());
    // this.vbo.render(this.mngProg.get('water').get());
    this.mngGltf
      .get("three")
      .render(this.mngProg.get("instancingDepth"), this.model);
    this.renderEntenna(this.mngProg.get("basique3d"));
    this.shadow.end();
    this.shadow.setBrightContrast(0.0, 3.0);
  }

  renderBasiqueForLampeDepth = () => {
    const lampe = this.getLampe(0);
    ["instancingDepth", "basique3d"].forEach((keyProg) => {
      const program = this.mngProg.get(keyProg);
      lampe.setDepthProgram(program);
    });
    lampe.start();
    this.mngGltf
      .get("three")
      .render(this.mngProg.get("instancingDepth"), this.model);
    this.renderEntenna(this.mngProg.get("basique3d"));
    lampe.end();

    // this.mngProg.get('water').setMatrix('projection', this.camera.getProjection().get());
    // this.mngProg.get('water').setMatrix('view', this.camera.getView().get());
  };

  renderEntenna(prog) {
    if (this.isAntennaVisible) {
      this.model.push();
      this.model.scale(0.07);
      this.model.translate(...this.currentPosAntenna);
      this.mngGltf.get("antenna").render(prog, this.model);
      this.model.pop();
    }
  }

  render() {
    // this.waterPasses();
    super.render();

    // this.shadowPass();

    // const progWater = this.mngProg.get('water');
    // progWater.setTexture(0, this.fbo.getTexture().get(), 'reflectMap');
    // progWater.setTexture(1, this.fbo2.getTexture().get(), 'refractMap');
    // progWater.setTexture(4, this.mngTex.get('waterN').get(), 'normaleMap');
    // progWater.setTexture(5, this.mngTex.get('dudv').get(), 'distortionMap');
    // progWater.setTexture(6, this.fbo2.getDepthTexture().get(), 'depthMap');

    // this.postProcess.start();
    this.vbo.render(this.mngProg.get("terrain").get());
    // this.vbo.render(progWater.get());
    this.mngGltf
      .get("three")
      .render(this.mngProg.get("instancing"), this.model);
    this.renderEntenna(this.mngProg.get("gltf"));
    // this.postProcess.end();

    // this.postProcess.setComposeShadow(this.shadow.getTexture().get());
    // this.postProcess.render();

    // this.postProcess.render(this.shadow.getTexture().get());
    // this.postProcess.render(this.getLampe(0).getDepthTexture().get());
    // this.postProcess.render(this.cloudsTex.get());
    // this.postProcess.render(this.fbo2.getDepthTexture().get());
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

  onMouseDrag = (mouse) => {
    this.targetZ.set(-mouse.relPrevious.x * 0.001);
    this.targetX.set(mouse.relPrevious.y * 0.001);
  };

  onMouseClick = (mouse) => {
    this.targetZ.set(-mouse.rel.x * 0.1);
    this.targetX.set(-mouse.rel.y * 0.1);
  };
}

export default TerrainScene;
