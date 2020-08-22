import Scene from '../webgl/scenes/SceneCamera';
import Screen from '../webgl/gl/Screen';
import VboPointsIndices from '../webgl/vbos/VboPointsIndices';
import Mat4 from '../webgl/maths/Mat4';
import { getPoints, getIndices } from '../webgl/primitives/grid';
import Bloom from '../webgl/postprocess/Bloom';

const nsin = (val) => {
  return Math.sin(val) * 0.5 + 0.5;
};

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
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.screen = new Screen(this.gl);

    this.bloom = new Bloom(gl, width, height, this.canUseDepth());
    this.bloom.setSize(0.4);
    this.bloom.setNbPass(4);
    this.bloom.setIntensity(1.1);

    this.model = new Mat4();

    // this.road = new GpuParticules(gl, 16, 128);
    const pointsRoads = getPoints(config.roadWidth, config.roadLength, {
      startX: -1,
      endX: 1,
      startZ: 0,
      endZ: config.roadLength,
    });
    const indicesRoads = getIndices(config.roadWidth, config.roadLength);
    this.roadVbo = new VboPointsIndices(gl, pointsRoads, indicesRoads);
    this.roadVbo.setModeDessin(gl.TRIANGLES);

    this.speed = 0.0;
    this.posShip = 0.0;
  }

  renderLandscape() {
    this.gl.disable(this.gl.DEPTH_TEST);
    const program = this.mngProg.get('skyWithFloor');
    program.setFloat('flipY', -1);
    program.setFloat('time', this.time * 0.05);
    this.screen.render(program.get());
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  render() {
    super.render();

    this.renderLandscape();

    this.model.identity();
    const { roadAmplitude, roadLength, roadFrequence, camera } = this.config;
    this.posShip += this.speed;

    const cameraTarget = getDistortion(0.2, roadFrequence, roadAmplitude, this.posShip);
    const cameraPos = getDistortion(0.0, roadFrequence, roadAmplitude, this.posShip);

    this.camera.setTarget(cameraTarget[0], camera.position.y + cameraTarget[1], roadLength);
    this.camera.setPosition(cameraPos[0], camera.position.y + cameraPos[1], 0);

    const program = this.mngProg.get('road3');
    program.setProjectionView(this.camera);
    program.setMatrix('model', this.model.get());
    program.setFloat('time', this.posShip);

    program.setVector('frequence', roadFrequence);
    program.setVector('amplitude', roadAmplitude);

    program.setFloat('roadLength', roadLength);
    // this.roadVbo.render(program.get());

    const shipZ = 2;
    const shipPos = getDistortion(shipZ / roadLength, roadFrequence, roadAmplitude, this.posShip);

    const programShip = this.mngProg.get('gltf');
    programShip.setProjectionView(this.camera);
    this.model.translate(shipPos[0], 0.4 + shipPos[1], shipZ);
    // this.mngGltf.get('raceship').render(programShip, this.model);
  }

  onMouseDrag = (mouse) => {};

  onMouseDown = (mouse) => {
    this.speed = 0.05;
  };

  onMouseUp = (mouse) => {
    this.speed = 0;
  };
}
