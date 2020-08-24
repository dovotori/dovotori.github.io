import Scene from '../webgl/scenes/SceneLampe';
import Screen from '../webgl/gl/Screen';
import VboPointsIndices from '../webgl/vbos/VboPointsIndices';
import Mat4 from '../webgl/maths/Mat4';
import { getPoints, getIndices } from '../webgl/primitives/grid';
import Bloom from '../webgl/postprocess/Bloom';
import Target from '../webgl/maths/Target';

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
    this.timeCloud = 0;

    // this.road = new GpuParticules(gl, 16, 128);
    const { roadLength, roadWidth } = config;

    const pointsRoads = getPoints(2, roadLength, {
      startX: -roadWidth,
      endX: roadWidth,
      startZ: 0,
      endZ: roadLength,
    });

    const pointsMountains = getPoints(120, roadLength, {
      startX: -120,
      endX: 120,
      startZ: 0,
      endZ: roadLength,
    });

    const indicesRoads = getIndices(2, roadLength);
    this.roadVbo = new VboPointsIndices(gl, pointsRoads, indicesRoads);
    this.roadVbo.setModeDessin(gl.TRIANGLES);

    const indicesMountains = getIndices(120, roadLength);
    this.mountainVbo = new VboPointsIndices(gl, pointsMountains, indicesMountains);
    this.mountainVbo.setModeDessin(gl.TRIANGLES);

    this.speedY = 0.0;
    this.posShipY = 0.0;
    this.isDown = false;
    this.target = new Target(0, 0.1);

    this.setLampeInfos(this.mngProg.get('gltf'));
    this.mngProg.get('roadSky').setTexture(1, this.mngTex.get('noisergb').get(), 'textureMap');
  }

  renderLandscape() {
    this.gl.disable(this.gl.DEPTH_TEST);
    const program = this.mngProg.get('roadSky');
    program.setFloat('flipY', -1);
    program.setFloat('time', this.time * 0.1);
    program.setVector('wind', [0.1, 0.2]);
    this.screen.render(program.get());
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  updateCamera = () => {
    const { roadAmplitude, roadLength, roadFrequence, camera } = this.config;

    const cameraTarget = getDistortion(0.2, roadFrequence, roadAmplitude, this.posShipY);
    const cameraPos = getDistortion(0.0, roadFrequence, roadAmplitude, this.posShipY);

    this.camera.setTarget(cameraTarget[0], camera.position.y + cameraTarget[1], roadLength);
    this.camera.setPosition(cameraPos[0], camera.position.y + cameraPos[1], 0);
  };

  renderMountain = () => {
    const { roadAmplitude, roadLength, roadFrequence } = this.config;
    const program = this.mngProg.get('roadmountain');
    program.setProjectionView(this.camera);
    program.setMatrix('model', this.model.get());
    program.setFloat('time', this.posShipY);

    program.setVector('frequence', roadFrequence);
    program.setVector('amplitude', roadAmplitude);

    program.setFloat('roadLength', roadLength);
    this.mountainVbo.render(program.get());
  };

  renderRoad = () => {
    const { roadAmplitude, roadLength, roadFrequence } = this.config;
    const program = this.mngProg.get('road3');
    program.setProjectionView(this.camera);
    program.setMatrix('model', this.model.get());
    program.setFloat('time', this.posShipY);

    program.setVector('frequence', roadFrequence);
    program.setVector('amplitude', roadAmplitude);

    program.setFloat('roadLength', roadLength);
    this.roadVbo.render(program.get());
  };

  renderShip = () => {
    this.target.update();
    if (this.isDown) {
      this.speedY += 0.01;
    }

    if (this.speedY < 0.0001) {
      this.speedY = 0.0;
    } else if (this.speedY > 0.1) {
      this.speedY = 0.1;
    } else {
      this.speedY *= 0.9;
    }
    this.posShipY += this.speedY;
    const { roadAmplitude, roadLength, roadFrequence } = this.config;
    const shipZ = 2;
    const shipPos = getDistortion(shipZ / roadLength, roadFrequence, roadAmplitude, this.posShipY);
    const programShip = this.mngProg.get('gltf');
    this.setLampeInfos(programShip);
    programShip.setProjectionView(this.camera);
    this.model.translate(this.target.get() + shipPos[0], 0.2 + shipPos[1], shipZ);
    this.mngGltf.get('raceship').render(programShip, this.model);
  };

  render() {
    super.render();
    this.model.identity();
    this.renderLandscape();
    this.updateCamera();
    this.renderMountain();
    this.renderRoad();
    this.renderShip();

    // this.bloom.start();
    // this.bloom.end();
    // this.bloom.render();
  }

  onMouseDrag = (mouse) => {
    this.speedX += mouse.rel.x * this.config.roadWidth;
    this.posShipX = -mouse.rel.x * this.config.roadWidth * 0.5;
    this.target.set(-mouse.rel.x * this.config.roadWidth * 0.5);
  };

  onMouseDown = (mouse) => {
    this.isDown = true;
  };

  onMouseUp = (mouse) => {
    this.isDown = false;
  };
}
