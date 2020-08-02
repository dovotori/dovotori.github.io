import Scene from '../webgl/scenes/SceneCamera';
import Screen from '../webgl/gl/Screen';
import LinesTrail from '../webgl/gl/LinesTrail';
import Grid from '../webgl/particules/Grid';
import Migration from '../webgl/particules/Migration';
import SimpleVbo from '../webgl/vbos/SimpleVbo';
import GpuParticules from '../webgl/particules/GpuParticules';
import Delaunay from '../lib/delaunay';
import VboPointsIndices from '../webgl/vbos/VboPointsIndices';
import Mat4 from '../webgl/maths/Mat4';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.screen = new Screen(this.gl);
    this.linesTrail = new LinesTrail(this.gl);

    this.grid = new Grid(10);
    this.vboGrid = new SimpleVbo(gl, this.grid.getPositions(), true);
    this.vboGrid.setModeDessin(this.gl.POINTS);

    this.migration = new Migration(40);
    this.vboMigration = new SimpleVbo(gl, this.migration.getPositions(), true);
    this.vboMigration.setModeDessin(this.gl.POINTS);

    this.particules = new GpuParticules(gl);

    const points = new Array(40).fill().map((_) => [Math.random(), Math.random()]);
    const indices = Delaunay.triangulate(points);
    const points3d = points.reduce((acc, cur) => [...acc, cur[0], cur[1], 0], []);
    this.vboDelaunay = new VboPointsIndices(gl, points3d, indices);

    this.model = new Mat4();

    this.setupControls();
  }

  setupControls = () => {
    this.mode = 0;
    this.buttons = document.querySelectorAll('.mode');
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', (e) => this.onClickButton(e.target, index), false);
    });
  };

  onClickButton = (button, index) => {
    this.buttons.forEach((b) => b.removeAttribute('data-current'));
    button.setAttribute('data-current', true);
    this.mode = index;
  };

  detroy = () => {
    if (this.buttons) {
      this.buttons.forEach((button, index) =>
        button.removeEventListener('click', () => this.onClickButton(index), false)
      );
    }
  };

  render() {
    super.render();
    // this.screen.render(this.mngProg.get(this.config.MAIN_PROG).get());

    this.model.identity();
    this.model.rotate(this.time, 0, 1, 0);

    // DEBUG
    // this.postProcess.render(texData.get());
    switch (this.mode) {
      default:
      case 0: {
        this.grid.update();
        this.vboGrid.update(this.grid.getPositions());
        this.vboGrid.render(this.mngProg.get('grid').get());
        break;
      }
      case 5: {
        this.migration.update();
        this.vboMigration.update(this.migration.getPositions());
        this.vboMigration.render(this.mngProg.get('migration').get());
        break;
      }
      case 4: {
        this.mngProg.get('basique3d').setMatrix('model', this.model.get());
        this.vboDelaunay.render(this.mngProg.get('basique3d').get());
        break;
      }
      case 1: {
        this.particules.compute(this.mngProg.get('pass1Morph'), this.time);
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
