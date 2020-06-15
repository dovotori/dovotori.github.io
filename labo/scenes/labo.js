import Scene from '../webgl/scenes/SceneLampe';
import TexturePerlinNoise from '../webgl/textures/TexturePerlinNoise';
import Mat4 from '../webgl/maths/Mat4';
import Spring from '../webgl/maths/Spring';
import Target from '../webgl/maths/Target';
import DualQuaternion from '../webgl/maths/DualQuaternion';
import { degToRad } from "../webgl/utils/numbers";

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.MAIN_PROG = config.MAIN_PROG;
    this.MAIN_OBJ = config.MAIN_OBJ;

    this.texture = new TexturePerlinNoise(gl, 256, 256);
    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(1, 0.05);
    this.mouseCanvasPosition = {
      x: 0,
      y: 0,
    };
  }

  update() {
    super.update();

    this.targetX.update();
    this.targetY.update();
    this.targetZ.update();

    this.model.identity();

    const angle = degToRad(this.targetX.get());
    const angle2 = degToRad(this.targetY.get());

    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    quat.rotateX(-angle2);
    this.model.multiply(quat.toMatrix4());

    const program = this.mngProg.get(this.MAIN_PROG);
    program.setVector("resolution", [
      this.containerSize.width,
      this.containerSize.height,
    ]);
    program.setFloat('time', this.time);
    this.setLampeInfos(program);
  }

  effects() {
    const delta = Math.cos(this.time * 0.01) * 0.04;
    if (delta > 0) {
      this.postProcess.setGlitch(
        this.time * 0.07 + this.target.get(),
        delta,
        delta
      );
    }
    this.postProcess.setWave(0.05, delta, [
      this.mouseCanvasPosition.x,
      this.mouseCanvasPosition.y,
    ]);
    this.postProcess.setFXAA();
  }

  mainRender = (program) => {
    // this.mngGltf.get(this.MAIN_OBJ).render(program, this.model);

    program.setMatrix("model", this.model.get());
    const normalmatrix = this.model.getMatrice3x3();
    normalmatrix.inverse();
    program.setMatrix("normalmatrix", normalmatrix.transpose());
    program.setTexture(2, this.texture.get(), "noiseMap");
    this.mngObj.get(this.MAIN_OBJ).render(program.get());
  }

  renderToBuffer = (program) => {
    this.mainRender(program);
  }

  renderBasiqueForShadow() {
    const program = this.mngProg.get("basique3d");
    program.setMatrix("projection", this.camera.getProjection().get());
    program.setMatrix("view", this.getLampeViewMatrix(0).get());
    program.setMatrix("model", this.model.get());
    this.renderToBuffer(program);
  }

  render() {
    super.render();
    const program = this.mngProg.get("bone");
    program.setMatrix("projection", this.camera.getProjection().get());
    program.setMatrix("view", this.camera.getView().get());
    // this.mngGltf.get(this.MAIN_OBJ).setBoneProgram(program);

    this.postProcess.start();
    this.mainRender(this.mngProg.get(this.MAIN_PROG));
    this.postProcess.end();

    // this.effects();
    this.postProcess.render();

    // DEBUG
    // this.postProcess.render(this.getLampeDepthTexture(0).get());
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
    this.targetY.set(mouse.relPrevious.y * 0.1);
  }

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 2);
    target = Math.max(target, 1);
    this.targetZ.set(target);
  }
}
