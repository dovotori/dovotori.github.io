import Mat4 from "../lib/utils/maths/Mat4";
import Target from "../lib/utils/maths/Target";
import Vec3 from "../lib/utils/maths/Vec3";
import { getIndices, getPoints } from "../lib/utils-3d/primitives/grid";
import Primitive from "../lib/webgl/gl/Primitive";
import Screen from "../lib/webgl/gl/Screen";
import Scene from "../lib/webgl/scenes/SceneLampe";

const ROAD_FREQUENCE = [2, 0, 2];
const ROAD_AMPLITUDE = [10, 0, 4];
const ROAD_LENGTH = 128;
const ROAD_WIDTH = 8;
const SHIP_POSITION = [0, 2, 3];

const nsin = (val) => Math.sin(val) * 0.5 + 0.5;

const getDistortion = (progress, frequence, amplitude, time) => {
  const movementProgressFix = 0.02;
  return [
    Math.cos(progress * Math.PI * frequence[0] + time) * amplitude[0] -
      Math.cos(movementProgressFix * Math.PI * frequence[0] + time) * amplitude[0],
    nsin(progress * Math.PI * frequence[1] + time) * amplitude[1] -
      nsin(movementProgressFix * Math.PI * frequence[1] + time) * amplitude[1],
    nsin(progress * Math.PI * frequence[2] + time) * amplitude[2] -
      nsin(movementProgressFix * Math.PI * frequence[2] + time) * amplitude[2],
  ];
};

export default class extends Scene {
  setup() {
    const { gl } = this;
    this.screen = new Screen(gl);
    this.model = new Mat4();

    const pointsRoads = getPoints(2, ROAD_LENGTH, {
      startX: -ROAD_WIDTH,
      endX: ROAD_WIDTH,
      startZ: 0,
      endZ: ROAD_LENGTH,
    });

    const pointsMountains = getPoints(120, ROAD_LENGTH, {
      startX: -120,
      endX: 120,
      startZ: 0,
      endZ: ROAD_LENGTH,
    });

    const indicesRoads = getIndices(2, ROAD_LENGTH);
    this.roadVbo = new Primitive(gl, {
      position: pointsRoads,
      indices: indicesRoads,
    });

    const indicesMountains = getIndices(120, ROAD_LENGTH);
    this.mountainVbo = new Primitive(gl, {
      position: pointsMountains,
      indices: indicesMountains,
    });

    this.shipPos = new Vec3(...SHIP_POSITION);
    this.currentShipPos = new Vec3(0.0);
    this.targetPosX = new Target(0, 0.1);
    this.targetSpeed = new Target(0, 0.1);
    this.posTime = 0.0;

    this.setLampeInfos(this.mngProg.get("gltf"));
    this.mngProg.get("roadSky").setTexture(1, this.mngTex.get("noisergb").get(), "textureMap");

    // this.bonus = new Primitive(gl, primitive);
  }

  update(time) {
    super.update(time);
    this.model.identity();
    this.moveShip();
    this.updateTrails();
    this.updateCamera();
    this.mngGltf.get("raceship").update(time);
  }

  getDistPos = (posZ) => {
    return new Vec3(
      ...getDistortion(posZ / ROAD_LENGTH, ROAD_FREQUENCE, ROAD_AMPLITUDE, this.posTime),
    );
  };

  updateCamera = () => {
    const { camera } = this.config;
    const cameraTarget = this.getDistPos(100);
    const cameraPos = this.getDistPos(0);
    this.camera.setTarget(
      cameraTarget.getX(),
      camera.position.y + cameraTarget.getY(),
      ROAD_LENGTH,
    );
    this.camera.setPosition(cameraPos.getX(), camera.position.y + cameraPos.getY(), 0);
  };

  moveShip = () => {
    this.targetPosX.update();
    this.targetSpeed.update();
    this.posTime += this.targetSpeed.get();
    const distPos = this.getDistPos(this.shipPos.getZ());
    this.currentShipPos.equal(distPos).add(this.shipPos).addX(this.targetPosX.get());
  };

  updateTrails() {
    const programShip = this.mngProg.get("gltf");
    const raceship = this.mngGltf.get("raceship");
    programShip.setProjectionView(this.camera);
    raceship.setAnimationStep("trail1", "scale", this.targetSpeed.get() * 10);
    raceship.setAnimationStep("trail2", "scale", this.targetSpeed.get() * 10);
  }

  renderMountain = () => {
    const program = this.mngProg.get("roadmountain");
    program.setProjectionView(this.camera);
    program.setMatrix("model", this.model.get());
    program.setFloat("time", this.posTime);
    program.setVector("frequence", ROAD_FREQUENCE);
    program.setVector("amplitude", ROAD_AMPLITUDE);
    program.setFloat("roadWidth", ROAD_WIDTH);
    program.setFloat("roadLength", ROAD_LENGTH);
    this.mountainVbo.render(program.get());
  };

  renderRoad = () => {
    const program = this.mngProg.get("road");
    program.setProjectionView(this.camera);
    program.setMatrix("model", this.model.get());
    program.setFloat("time", this.posTime);
    program.setVector("frequence", ROAD_FREQUENCE);
    program.setVector("amplitude", ROAD_AMPLITUDE);
    program.setFloat("roadWidth", ROAD_WIDTH);
    program.setFloat("roadLength", ROAD_LENGTH);
    this.roadVbo.render(program.get());
  };

  renderLandscape() {
    this.gl.disable(this.gl.DEPTH_TEST);
    const program = this.mngProg.get("roadSky");
    program.setFloat("flipY", -1);
    program.setFloat("time", this.time * 0.1);
    program.setVector("wind", [0.1, 0.2]);
    this.screen.render(program.get());
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  renderTunnel() {
    this.gl.disable(this.gl.DEPTH_TEST);
    const program = this.mngProg.get("tunnelrace");
    program.setFloat("flipY", -1);
    // program.setFloat('time', this.time * 0.005 + this.posTime * 5.0);
    program.setFloat("time", this.time * 0.001);
    this.screen.render(program.get());
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  renderShip = () => {
    const programShip = this.mngProg.get("gltf");
    const raceship = this.mngGltf.get("raceship");
    this.model.push();
    this.model.translate(...this.currentShipPos.get());
    raceship.renderExcept(["trail1", "trail2"], programShip, this.model);
    this.model.pop();
  };

  renderShipTrails = () => {
    const programShip = this.mngProg.get("gltf");
    const raceship = this.mngGltf.get("raceship");
    this.model.push();
    this.model.translate(...this.currentShipPos.get());
    raceship.renderOnly(["trail1", "trail2"], programShip, this.model);
    this.model.pop();
  };

  render() {
    super.render();

    this.postProcess.start();

    // this.renderLandscape();
    this.renderTunnel();
    this.renderMountain();
    this.renderRoad();
    this.renderShip();
    // this.bonus.render(this.mngProg.get('basique3d').program.get());

    this.postProcess.end();

    this.bloom.start();
    this.renderShipTrails();
    this.bloom.end();

    this.postProcess.mergeBloom(this.bloom.getTexture(), 1.5, 2.2);

    const delta = this.targetSpeed.get() * 100.0;
    this.postProcess.setRGB(delta, delta, 0.5, 0.5);
    this.postProcess.setFxaa2();
    this.postProcess.render();
  }

  interactShip = (mouse) => {
    this.targetSpeed.set(0.1);
    this.targetPosX.set(-mouse.rel.x * ROAD_WIDTH * 0.6);
  };

  onMouseDrag = (mouse) => {
    this.interactShip(mouse);
  };

  onMouseDown = (mouse) => {
    this.interactShip(mouse);
  };

  onMouseUp = () => {
    this.targetSpeed.set(0);
  };
}
