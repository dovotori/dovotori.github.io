import Scene from '../webgl/scenes/SceneLampe';
import TexturePerlinNoise from '../webgl/textures/TexturePerlinNoise';
import Mat4 from '../webgl/maths/Mat4';
import Spring from '../webgl/maths/Spring';
import Target from '../webgl/maths/Target';
import DualQuaternion from '../webgl/maths/DualQuaternion';
import { mapFromRange, degToRad } from "../webgl/utils/numbers";

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.MAIN_PROG = config.MAIN_PROG;
    this.MAIN_OBJ = config.MAIN_OBJ;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.renderToBuffer = this.renderToBuffer.bind(this);

    this.texture = new TexturePerlinNoise(gl, 256, 256);
    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Target(0, 0.2);
    this.targetY = new Target(0, 0.2);
    this.target = new Spring(0, 0.2);
    this.mouseCanvasPosition = {
      x: 0,
      y: 0,
    };
  }

  update() {
    super.update();

    this.targetX.update();
    this.targetY.update();
    this.target.update();

    this.model.identity();

    const angle =
      degToRad(this.targetX.get()) + Math.sin(this.time * 0.06) * 0.1;
    const angle2 =
      degToRad(this.targetY.get()) - Math.abs(Math.cos(this.time * 0.06) * 0.1);

    const quat = new DualQuaternion();
    quat.rotateY(angle);
    quat.rotateX(angle2);
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

  mainRender(program) {
    this.mngGltf.get(this.MAIN_OBJ).render(program, this.model);
  }

  renderToBuffer(program) {
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

    if (this.config.support.useDepth) {
      this.postProcess.start();
      this.mainRender(this.mngProg.get(this.MAIN_PROG));
      this.postProcess.end();

      this.effects();
      this.postProcess.render();
    } else {
      this.mainRender(this.mngProg.get(this.MAIN_PROG));
    }
    
    // DEBUG
    // this.postProcess.render(this.getLampeDepthTexture(0).get());
    // this.postProcess.render(this.buffers.getShadowTexture().get());
  }

  onMouseMove(mouse) {
    const x = mapFromRange(mouse.pos.x, 0, mouse.size.width, -32, 32);
    const y = mapFromRange(mouse.pos.y, 0, mouse.size.height, -32, 32);
    this.targetX.set(x);
    this.targetY.set(y);
    this.target.set(mouse.relPrevious.x);
    this.mouseCanvasPosition = {
      x: mapFromRange(mouse.pos.x, 0, mouse.size.width, 0, 1),
      y: mapFromRange(mouse.pos.y, 0, mouse.size.height, 1, 0),
    };
  }
}
