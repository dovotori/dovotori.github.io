import Delaunay from '../lib/delaunay';
import Primitive from '../lib/webgl/gl/Primitive';
import Screen from '../lib/webgl/gl/Screen';
import LinesTrail from '../lib/webgl/lines/LinesTrail';
import Mat4 from '../lib/webgl/maths/Mat4';
import Vec3 from '../lib/webgl/maths/Vec3';
import GpuParticules from '../lib/webgl/particules/GpuParticules';
import Grid from '../lib/webgl/particules/Grid';
import Migration from '../lib/webgl/particules/Migration';
import { getIndices, getPoints } from '../lib/webgl/primitives/grid';
import { getGridPerlinPoints, getGridPoints } from '../lib/webgl/primitives/particules';
import Scene from '../lib/webgl/scenes/SceneCamera';
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
      nsin(movementProgressFix * Math.PI * frequence.getZ() + time) * amplitude.getZ(),
  );
};

export default class extends Scene {
  setup() {
    const { gl } = this;
    this.screen = new Screen(gl);
    this.linesTrail = new LinesTrail(gl);

    this.grid = new Grid(40);
    this.vboGrid = new Primitive(gl, { position: this.grid.getPositions() }, true);
    this.vboGrid.setModeDessin(gl.POINTS);

    this.migration = new Migration(40);
    this.vboMigration = new Primitive(gl, { position: this.migration.getPositions() }, true);
    this.vboMigration.setModeDessin(gl.POINTS);

    this.particules = new GpuParticules(gl, 32, 32);
    this.particules.addDataTexture('textureMap', getGridPerlinPoints(32, 32));
    this.particules.addDataTexture('morphMap', getGridPoints(32, 32));

    const points = Array.from({ length: 40 }, () => [
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
    ]);
    const indices = Delaunay.triangulate(points);
    const points3d = points.reduce(
      (acc, cur) => [...acc, cur[0], cur[1], Math.random() * 2.0 - 1.0],
      [],
    );
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

    this.mousePos = [0, 0];

    const CIRCLE_VERTICES_COUNT = 256;
    const CIRCLES_COUNT = 10;
    const indexes = new Array(CIRCLE_VERTICES_COUNT).fill(0).map((_, index) => index);
    this.circleVbo = new Primitive(gl, { index: indexes });
    this.circleVbo.setModeDessin(gl.LINE_LOOP);
    const progCircle = this.mngProg.get('movingCircle');
    progCircle.setInt('length', CIRCLE_VERTICES_COUNT);
    progCircle.setInt('count', CIRCLES_COUNT);
    progCircle.setVector('mouse', this.mousePos);

    const pos = new Array(CIRCLES_COUNT).fill(0).map((_, index) => index);
    const offset = {
      componentType: gl.FLOAT,
      count: CIRCLES_COUNT,
      size: 1,
      type: 'VEC3',
      values: new Float32Array(pos),
    };
    this.circleVbo.addInstancingVbos(CIRCLES_COUNT, {
      offset,
    });

    this.setupControls();
  }

  setupControls = () => {
    this.mode = 0;
    this.message = document.querySelector('#message');
    this.buttons = document.querySelectorAll('.mode');
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        this.onClickButton(e.target, index);
      });
    });
  };

  onClickButton = (button, index) => {
    this.buttons.forEach((b) => b.removeAttribute('data-current'));
    button.setAttribute('data-current', true);
    this.mode = index;

    if (index === 2) {
      this.message.style.display = 'block';
    } else {
      this.message.style.display = 'none';
    }
  };

  destroy = () => {
    if (this.buttons) {
      this.buttons.forEach((button, index) =>
        button.removeEventListener('click', () => this.onClickButton(index), false),
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
        this.model.rotate(this.time * 0.005, 0, 1, 0);
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
          this.roadLength,
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
      case 7: {
        this.model.rotate(this.mousePos[0] * 40 - 20, 0, 1, 0);
        const progCircle = this.mngProg.get('movingCircle');
        progCircle.setMatrix('model', this.model.get());
        progCircle.setFloat('time', this.time * 0.001);
        progCircle.setVector('mouse', this.mousePos);
        this.circleVbo.render(progCircle.get());
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

  onMouseMove = (mouse) => {
    this.mousePos = [
      mouse.relScroll.x / mouse.size.width,
      1 - mouse.relScroll.y / mouse.size.height,
    ];
  };
}
