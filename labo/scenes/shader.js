import Scene from '../webgl/scenes/SceneCamera';
import Screen from '../webgl/gl/Screen';
// import LinesTrail from '../webgl/gl/LinesTrail';
// import Grid from '../webgl/particules/Grid';
// import Migration from '../webgl/particules/Migration';
// import SimpleVbo from '../webgl/vbos/SimpleVbo';
import GpuParticules from '../webgl/particules/GpuParticules';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.MAIN_PROG = config.MAIN_PROG;
    this.MAIN_OBJ = config.MAIN_OBJ;

    this.screen = new Screen(this.gl);
    // this.linesTrail = new LinesTrail(this.gl);
    // this.grid = new Grid(10);
    // this.migration = new Migration(40);
    // this.vbo = new SimpleVbo(gl, this.migration.getPositions(), true);
    // this.vbo = new SimpleVbo(gl, this.grid.getPositions(), true);
    // this.vbo.setModeDessin(this.gl.POINTS);
    this.particules = new GpuParticules(gl);
  }

  update() {
    super.update();
    const program = this.mngProg.get(this.MAIN_PROG);
    program.setFloat('time', this.time);

    // this.grid.update();
    // this.migration.update();
    // this.vbo.update(this.migration.getPositions());
    // this.vbo.update(this.grid.getPositions());
  }

  render() {
    super.render();
    // this.screen.render(this.mngProg.get(this.MAIN_PROG).get());
    // const program = this.mngProg.get(this.MAIN_PROG);
    // this.linesTrail.update(program);
    // this.linesTrail.render(program);

    // this.vbo.render(program.get());

    // DEBUG
    // this.postProcess.render(texData.get());
    this.particules.compute(this.mngProg.get('pass1Morph'), this.time);
    this.resizeViewport();
    this.particules.render(this.camera, this.mngProg.get('pass2Camera'), this.time);
  }

  onMouseDrag = (mouse) => {
    // this.linesTrail.onMouseDrag(mouse);
  };

  onMouseDown = (mouse) => {
    // this.linesTrail.onMouseDown(mouse);
  };
}
