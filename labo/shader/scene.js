import Scene from '../lib/webgl/scenes/SceneCamera';
import Screen from '../lib/webgl/gl/Screen';
import LinesTrail from '../lib/webgl/lines/LinesTrail';
import Grid from '../lib/webgl/particules/Grid';
import Migration from '../lib/webgl/particules/Migration';
import GpuParticules from '../lib/webgl/particules/GpuParticules';
import Delaunay from '../lib/delaunay';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import Vec3 from '../lib/webgl/maths/Vec3';
import { getGridPerlinPoints, getGridPoints } from '../lib/webgl/primitives/particules';
import { getPoints, getIndices } from '../lib/webgl/primitives/grid';
import { mapFromRange } from '../lib/webgl/utils/numbers';

const nsin = (val) => Math.sin(val) * 0.5 + 0.5;

const getDistortion = (progress, frequence, amplitude, time) => {
  const movementProgressFix = 0.02;
  return new Vec3(
    Math.cos(progress * Math.PI * frequence.getX() + time) * amplitude.getX() -
    Math.cos(movementProgressFix * Math.PI * frequence.getX() + time) * amplitude.getX(),
    nsin(progress * Math.PI * frequence.getY() + time) * amplitude.getY() -
    nsin(movementProgressFix * Math.PI * frequence.getY() + time) * amplitude.getY(),
    nsin(progress * Math.PI * frequence.getZ() + time) * amplitude.getZ() -
    nsin(movementProgressFix * Math.PI * frequence.getZ() + time) * amplitude.getZ()
  );
};

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.screen = new Screen(this.gl);
    this.linesTrail = new LinesTrail(this.gl);

    this.grid = new Grid(40);
    this.vboGrid = new Primitive(gl, { position: this.grid.getPositions() }, true);
    this.vboGrid.setModeDessin(this.gl.POINTS);

    this.migration = new Migration(40);
    this.vboMigration = new Primitive(gl, { position: this.migration.getPositions() }, true);
    this.vboMigration.setModeDessin(this.gl.POINTS);

    this.particules = new GpuParticules(gl, 32, 32);
    this.particules.addDataTexture('textureMap', getGridPerlinPoints(32, 32));
    this.particules.addDataTexture('morphMap', getGridPoints(32, 32));

    const points = Array.from({ length: 40 }, () => [
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
    ]);
    const indices = Delaunay.triangulate(points);
    const points3d = points.reduce((acc, cur) => [...acc, cur[0], cur[1], Math.random() * 2.0 - 1.0], []);
    this.vboDelaunay = new Primitive(gl, { position: points3d, indices });
    this.vboDelaunay.setModeDessin(gl.LINE_LOOP);

    this.bloom.setBlurSize(0.4);
    this.bloom.setBlurIntensity(1.1);

    this.model = new Mat4();

    // this.road = new GpuParticules(gl, 16, 128);
    const roadWidth = 2;
    const roadDepth = 128;
    const pointsRoads = getPoints(roadWidth, roadDepth, {
      startX: -1,
      endX: 1,
      startZ: 0,
      endZ: roadDepth,
    });
    const indicesRoads = getIndices(roadWidth, roadDepth);
    this.roadVbo = new Primitive(gl, { position: pointsRoads, indices: indicesRoads });

    this.roadFrequence = new Vec3(2, 0, 2);
    this.roadAmplitude = new Vec3(10, 0, 4);
    this.roadPositionY = 1.2;
    this.roadLength = 128;

    this.setupControls();
  }

  setupControls = () => {
    this.mode = 0;
    this.message = document.querySelector('#message');
    this.buttons = document.querySelectorAll('.mode');
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', (e) => this.onClickButton(e.target, index), false);
    });
  };

  onClickButton = (button, index) => {
    this.buttons.forEach((b) => b.removeAttribute('data-current'));
    button.setAttribute('data-current', true);
    this.mode = index;

    if (index === 2) {
      this.message.style.display = "block";
    } else {
      this.message.style.display = "none";
    }
  };

  destroy = () => {
    if (this.buttons) {
      this.buttons.forEach((button, index) =>
        button.removeEventListener('click', () => this.onClickButton(index), false)
      );
    }
  };

  render() {
    super.render();

    this.model.identity();

    const { position, target } = this.config.camera;
    this.camera.setTarget(target.x, target.y, target.z);
    this.camera.setPosition(position.x, position.y, position.z);

    switch (this.mode) {
      case 3: {
        this.migration.update();
        this.vboMigration.update({ position: this.migration.getPositions() });
        this.vboMigration.render(this.mngProg.get('point').get());
        break;
      }
      case 0: {
        this.model.rotate(this.time * 0.01, 0, 1, 0);
        this.mngProg.get('basique3d').setMatrix('model', this.model.get());
        this.bloom.start();
        this.vboDelaunay.render(this.mngProg.get('basique3d').get());
        this.bloom.end();
        this.bloom.render();
        break;
      }
      case 1: {
        this.model.rotate(this.time * 0.001, 0, 1, 0);
        const newTime = mapFromRange(Math.cos(this.time * 0.01 * 0.05), -1, 1, 0, 1);
        this.particules.compute(this.mngProg.get('pass1Morph'), newTime);
        this.resizeViewport();
        this.mngProg.get('pass2Camera').setMatrix('model', this.model.get());
        this.particules.render(this.mngProg.get('pass2Camera'));
        break;
      }
      case 2: {
        const program = this.mngProg.get('line');
        this.linesTrail.update(program);
        this.linesTrail.render(program);
        break;
      }
      case 4: {
        const time = this.time * 0.005;

        const cameraPos = getDistortion(0.0, this.roadFrequence, this.roadAmplitude, time);
        const cameraTarget = getDistortion(0.2, this.roadFrequence, this.roadAmplitude, time);

        this.camera.setTarget(
          cameraTarget.getX(),
          this.roadPositionY + cameraTarget.getY(),
          this.roadLength
        );
        this.camera.setPosition(cameraPos.getX(), this.roadPositionY + cameraPos.getY(), 0);

        const program = this.mngProg.get('road');
        program.setProjectionView(this.camera);
        program.setMatrix('model', this.model.get());
        program.setFloat('time', time);

        program.setVector('frequence', this.roadFrequence.get());
        program.setVector('amplitude', this.roadAmplitude.get());

        program.setFloat('roadLength', this.roadLength);
        // this.road.render(program);
        this.roadVbo.render(program.get());
        break;
      }
      case 6: {
        const program = this.mngProg.get('landscape');
        program.setFloat('flipY', 1);
        program.setFloat('time', this.time * 0.001);
        this.screen.render(program.get());
        break;
      }
      case 5:
      default: {
        this.grid.update();
        this.vboGrid.update({ position: this.grid.getPositions() });
        this.vboGrid.render(this.mngProg.get('point').get());
        break;
      }
    }
  }

  onMouseDrag = (mouse) => {
    if (this.mode === 2) {
      this.linesTrail.onMouseDrag(mouse);
    }
  };

  onMouseDown = (mouse) => {
    if (this.mode === 2) {
      this.linesTrail.onMouseDown(mouse);
    }
  };
}
