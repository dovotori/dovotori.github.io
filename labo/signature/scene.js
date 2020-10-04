import Scene from '../lib/webgl/scenes/SceneLampe';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import Target from '../lib/webgl/maths/Target';
import DualQuaternion from '../lib/webgl/maths/DualQuaternion';
import { mapFromRange, degToRad } from '../lib/webgl/utils/numbers';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Target(0, 0.2);
    this.targetY = new Target(0, 0.2);
    this.targetScale = new Target(0, 0.1);
    this.target = new Spring(0, 0.2);
    this.mouseCanvasPosition = {
      x: 0,
      y: 0,
    };
    this.targetScale.set(1);
  }

  update(time) {
    super.update(time);

    this.targetX.update();
    this.targetY.update();
    this.target.update();
    this.targetScale.update();

    this.model.identity();

    const angle = degToRad(this.targetX.get()) + Math.sin(this.time * 0.005) * 0.1;
    const angle2 = degToRad(this.targetY.get()) - Math.abs(Math.cos(this.time * 0.005) * 0.1);

    this.model.scale(this.targetScale.get());

    const quat = new DualQuaternion();
    quat.rotateY(angle);
    quat.rotateX(angle2);
    this.model.multiply(quat.toMatrix4());

    const program = this.mngProg.get(this.config.MAIN_PROG);
    program.setFloat('time', this.time);
    this.setLampeInfos(program);
  }

  effects() {
    const delta = Math.cos(this.time * 0.001) * 0.05;
    if (delta > 0) {
      this.postProcess.setGlitch(this.time * 0.07 + this.target.get(), delta, -delta);
    }
    this.postProcess.setWave(0.05, delta, [this.mouseCanvasPosition.x, this.mouseCanvasPosition.y]);
    this.postProcess.setFXAA();
  }

  mainRender(program) {
    this.mngGltf.get(this.config.MAIN_OBJ).render(program, this.model);
  }

  render() {
    super.render();

    if (this.canUseDepth()) {
      this.postProcess.start();
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
      this.postProcess.end();

      this.effects();
      this.postProcess.render();
    } else {
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
    }

    // DEBUG
    // this.postProcess.render(this.getLampeDepthTexture(0).get());
    // this.postProcess.render(this.buffers.getShadowTexture().get());
  }

  onMouseMove = (mouse) => {
    const x = mapFromRange(mouse.pos.x, 0, mouse.size.width, -32, 32);
    const y = mapFromRange(mouse.pos.y, 0, mouse.size.height, -32, 32);
    this.targetX.set(x);
    this.targetY.set(y);
    this.target.set(mouse.relPrevious.x);
    this.mouseCanvasPosition = {
      x: mapFromRange(mouse.pos.x, 0, mouse.size.width, 0, 1),
      y: mapFromRange(mouse.pos.y, 0, mouse.size.height, 1, 0),
    };
  };
}
